using BinaryQuest.Framework.Core;
using BinaryQuest.Framework.Core.Exceptions;
using BinaryQuest.Framework.Core.Extensions;
using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Security;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TimeZoneConverter;

namespace BinaryQuest.Framework.Core.Model
{
    public class AppConfigOptions
    {
        private AppConfigOptions(string applicationName, string defaultLanguage, TimeZoneInfo defaultTimeZone, bool allowUserRegistration)
        {
            this.DefaultTimeZone = defaultTimeZone;
            this.DefaultLanguage = defaultLanguage ?? "en_US";
            this.AllowUserRegistration = allowUserRegistration;
            this.ApplicationName = applicationName ?? "BQ Framework App";
            this.SecurityRulesProvider = new FileBasedSecurityRulesProvider("config");
            this.registeredControllers = new();
            this.modelBuilder = new ODataConventionModelBuilder();
            //this.modelBuilder.Namespace = "bq";
        }

        public static AppConfigOptions Default => new("BQ Framework App", "en_US", TZConvert.GetTimeZoneInfo("UTC"), true);

        public string ApplicationName { get; private set; }
        public bool AllowUserRegistration { get; private set; }
        public string DefaultLanguage { get; private set; }
        public string DefaultAdminRole { get; private set; }
        public TimeZoneInfo DefaultTimeZone { get; private set; }
        public ISecurityRulesProvider SecurityRulesProvider { get; set; }

        private readonly Dictionary<Type, Type> registeredControllers;
        private readonly ODataConventionModelBuilder modelBuilder;

        public ODataConventionModelBuilder Builder => modelBuilder;

        public AppConfigOptions SetApplicationName(string name)
        {
            ApplicationName = name ?? "BQ Framework App";
            return this;
        }

        public AppConfigOptions SetAllowUserRegistration(bool allowRegistration)
        {
            AllowUserRegistration = allowRegistration;
            return this;
        }

        public AppConfigOptions SetDefaultLanguage(string defaultLanguage)
        {
            DefaultLanguage = defaultLanguage;
            return this;
        }

        public AppConfigOptions SetDefaultTimeZone(TimeZoneInfo defaultTimeZone)
        {
            DefaultTimeZone = defaultTimeZone;
            return this;
        }

        public AppConfigOptions SetDefaultAdminRole(string defaultAdminRole)
        {
            DefaultAdminRole = defaultAdminRole;
            return this;
        }

        public AppConfigOptions SetSecurityRulesProvider(ISecurityRulesProvider provider)
        {
            SecurityRulesProvider = provider;
            return this;
        }

        
        public AppConfigOptions RegisterController<TEntity, TController>(Action<EntitySetConfiguration<TEntity>> entityConfig = null) where TController : ODataController where TEntity : class
        {

            var name = typeof(TController).Name.TrimEnd("Controller");
            var entitySet = modelBuilder.EntitySet<TEntity>(name);            

            var actionMethods = typeof(TController).GetMethods().Where(m => m.GetCustomAttributes(typeof(CustomActionAttribute), true).Length > 0).ToArray();

            foreach (var item in actionMethods)
            {
                entitySet.EntityType.Collection.Action(item.Name).Returns(item.ReturnType);
            }

            var functionMethods = typeof(TController).GetMethods().Where(m => m.GetCustomAttributes(typeof(CustomFunctionAttribute), true).Length > 0).ToArray();

            foreach (var item in functionMethods)
            {
                var fnc = entitySet.EntityType.Collection.Function(item.Name).Returns(item.ReturnType);
                fnc.Parameter<string>("key").Optional();
            }

            if (registeredControllers.ContainsKey(typeof(TEntity)))
            {
                throw new BootException($"Type {nameof(TEntity)} already registered");
            }

            if (entityConfig != null)
            {
                entityConfig(entitySet);
            }

            registeredControllers.Add(typeof(TEntity), typeof(TController));

            return this;
        }

        internal IEdmModel GetEdmModel<TDb>(IServiceCollection services, ApplicationService appSvc) where TDb : DbContext
        {
            //add the Not Mapped properties of BaseEntity types as the NotMapped is also ignored by
            //OData plus EF. SO need a way to include this in OData and ignore it in EF db.
            var structuralTypes = modelBuilder.StructuralTypes;

            foreach (var st in structuralTypes)
            {
                Type clrType = st.ClrType;

                var mapInfrontend = clrType.GetProperties().Where(x => x.GetCustomAttribute<MapInFrontendAttribute>() != null && x.GetCustomAttribute<NotMappedAttribute>() != null).ToList();
                if (mapInfrontend.Count > 0)
                {
                    foreach (var mapPro in mapInfrontend)
                    {
                        if (mapPro.PropertyType.IsEnum)
                        {
                            st.AddEnumProperty(st.ClrType.GetProperty(mapPro.Name));
                        }
                        else
                        {
                            st.AddProperty(st.ClrType.GetProperty(mapPro.Name));
                        }
                    }
                }
                //var notMapped = clrType.GetProperties().Where(x => x.Name == "RecordState").ToList();
                //if (notMapped.Count > 0)
                //{
                //    st.AddEnumProperty(st.ClrType.GetProperty("RecordState"));
                //}                               
            }

            //modelBuilder.EnableLowerCamelCase();            

            var edmxModel = modelBuilder.GetEdmModel();

            ParseMetaData<TDb>(services, appSvc);

            return edmxModel;
        }


        private void ParseMetaData<TDb>(IServiceCollection services, ApplicationService appSvc) where TDb : DbContext
        {
            Dictionary<Type, IEntityType> efStructuralTypes = new();            
            var defContext = services.BuildServiceProvider().GetService<TDb>();
            
            var edmxEntityTypes = defContext.Model.GetEntityTypes();
            foreach (var entType in edmxEntityTypes)
            {
                efStructuralTypes.Add(entType.ClrType, entType);
            }


            Dictionary<Type, Type> dbSets = new();
            var dbTypes = typeof(TDb).GetProperties();
            foreach (var dbType in dbTypes)
            {
                var pType = dbType.PropertyType;
                var isDbSet = pType.IsGenericType && (typeof(DbSet<>).IsAssignableFrom(pType.GetGenericTypeDefinition()));
                if (isDbSet)
                {
                    var entityType = pType.GetGenericArguments()[0];
                    dbSets.Add(entityType, entityType);
                }
            }

            foreach (var typeToReflect in registeredControllers.Keys)
            {
                ParseType(appSvc, efStructuralTypes, dbSets, typeToReflect);
            }
        }

        private void ParseType(ApplicationService appSvc, Dictionary<Type, IEntityType> efStructuralTypes, Dictionary<Type, Type> dbSets, Type typeToReflect)
        {
            var controllerType = registeredControllers[typeToReflect];
            bool isDefinedInContext = dbSets.ContainsKey(typeToReflect);

            Dictionary<string, MetadataField> fields = new();
            efStructuralTypes.TryGetValue(typeToReflect, out IEntityType efEntityType);

            var props = typeToReflect.GetProperties();

            List<PrimaryKey> keys = new();

            var keyName = "";
            var keyType = "";

            foreach (var prop in props)
            {
                var notMappedAttribute = prop.GetCustomAttribute<NotMappedAttribute>();
                var mapinFrontendAttribute = prop.GetCustomAttribute<MapInFrontendAttribute>();                

                if (notMappedAttribute!=null && mapinFrontendAttribute==null)
                    continue;

                MetadataField field = new();

                var atts = prop.GetCustomAttributes(
                typeof(KeyAttribute), true);
                if (atts.Length > 0)
                {
                    keyName = prop.Name;
                    keyType = prop.PropertyType.Name;
                    keys.Add(new PrimaryKey() { KeyName = keyName, KeyType = keyType });
                    field.IsPrimaryKey = true;
                }
                else if (efEntityType != null)
                {
                    var efPrimaryKey = efEntityType.FindPrimaryKey();
                    if (efPrimaryKey != null)
                    {
                        //if (efPrimaryKey.Properties.Count > 1)
                        //{
                        //    //composit keys are not supported
                        //    throw new BootException($"Composit Keys for {typeToReflect.FullName} is not supported yet");
                        //}
                        var efKey = efPrimaryKey.Properties.Where(s => s.Name == prop.Name).FirstOrDefault();
                        if (efKey != null)
                        {
                            keyName = efKey.Name;
                            keyType = efKey.ClrType.Name;
                            keys.Add(new PrimaryKey() { KeyName = keyName, KeyType = keyType });
                            field.IsPrimaryKey = true;
                        }
                    }
                    var navigation = efEntityType.GetNavigations().Where(n => n.ClrType.Name == prop.Name).FirstOrDefault();
                    if (navigation!=null)
                    {
                        field.ForeignKeyName = navigation.Name;
                    }
                }

                field.Name = prop.Name;
                field.Caption = GetAttributeDisplayName(prop);
                field.DataType = prop.PropertyType.Name;
                field.GenericDataType = prop.PropertyType.Name;

                if (efEntityType != null)
                {
                    var efProp = efEntityType.FindProperty(prop.Name);
                    if (efProp != null)
                    {
                        field.MaxLength = efProp.GetMaxLength();
                        field.AutoGen = efProp.ValueGenerated != ValueGenerated.Never;
                        field.IsNullable = efProp.IsNullable;
                        field.IsForeignKey = efProp.IsForeignKey();
                    }
                    else //we will come here if a property is marked as notMapped in EF
                    {
                        bool canBeNull = !prop.PropertyType.IsValueType || (Nullable.GetUnderlyingType(prop.PropertyType) != null);
                        field.IsNullable = canBeNull;
                    }
                }

                if (prop.PropertyType.IsValueType)
                {
                    var underType = Nullable.GetUnderlyingType(prop.PropertyType);
                    if (underType != null)
                    {
                        field.DataType = underType.Name;
                    }
                    if (prop.PropertyType.IsEnum)
                    {
                        field.IsEnum = true;
                        field.Enums = new List<EnumItem>();
                        foreach (int value in Enum.GetValues(prop.PropertyType))
                        {
                            EnumItem item = new() { Id = value, Name = Enum.GetName(prop.PropertyType, value) };
                            field.Enums.Add(item);
                        }
                        field.DataType = "Enum";
                    }
                }
                ReadPropertyMetadata(prop, field);

                if (field.DataType == "ICollection`1")
                {
                    ReadChildFields(prop, field, efStructuralTypes);

                }
                else if (!string.IsNullOrEmpty(field.ForeignKeyName))
                {
                    //read complex type
                    ReadChildFields(prop.PropertyType, field, efStructuralTypes);
                }

                fields.Add(field.Name, field);

            }


            var data = new ModelMetadata
            {
                AllowAdd = true, //default values, on api call core controller will update them from service
                AllowEdit = true,
                AllowDelete = true,
                TypeName = typeToReflect.Name,
                Keys = keys,
                Fields = fields
            };

            appSvc.Bootdata.MetaDataValues[typeToReflect] = data;
        }

        private static void ReadChildFields(PropertyInfo prop1, MetadataField parentField, Dictionary<Type, IEntityType> efStructuralTypes)
        {
            var genericArgs = prop1.PropertyType.GetGenericArguments();
            if (genericArgs != null && genericArgs.Length > 0)
            {
                var typeToReflect = genericArgs[0];
                parentField.GenericDataType = typeToReflect.Name;
                ReadChildFields(typeToReflect, parentField, efStructuralTypes);
            }
        }
        private static void ReadChildFields(Type typeToReflect, MetadataField parentField, Dictionary<Type, IEntityType> efStructuralTypes)
        {
            Dictionary<string, MetadataField> fields = new();

            var props = typeToReflect.GetProperties();
            efStructuralTypes.TryGetValue(typeToReflect, out IEntityType efEntityType);

            foreach (var prop in props)
            {
                var notMappedAttribute = prop.GetCustomAttribute<NotMappedAttribute>();
                var mapinFrontendAttribute = prop.GetCustomAttribute<MapInFrontendAttribute>();

                if (notMappedAttribute != null && mapinFrontendAttribute == null)
                    continue;

                MetadataField field = new();

                var atts = prop.GetCustomAttributes(
                typeof(KeyAttribute), true);
                if (atts.Length > 0)
                {
                    field.IsPrimaryKey = true;
                }
                else if (efEntityType != null)
                {
                    var efPrimaryKey = efEntityType.FindPrimaryKey();
                    if (efPrimaryKey != null)
                    {
                        var efKey = efPrimaryKey.Properties.Where(s => s.Name == prop.Name).FirstOrDefault();
                        if (efKey != null)
                        {
                            field.IsPrimaryKey = true;
                        }
                    }
                    var navigation = efEntityType.GetNavigations().Where(n => n.ClrType.Name == prop.Name).FirstOrDefault();
                    if (navigation != null)
                    {
                        field.ForeignKeyName = navigation.Name;
                    }
                }

                field.Name = prop.Name;
                field.Caption = GetAttributeDisplayName(prop);
                field.DataType = prop.PropertyType.Name;
                if (prop.PropertyType.IsValueType)
                {
                    var underType = Nullable.GetUnderlyingType(prop.PropertyType);
                    if (underType != null)
                    {
                        field.DataType = underType.Name;
                    }
                }
                ReadPropertyMetadata(prop, field);

                if (efEntityType != null)
                {
                    var efProp = efEntityType.FindProperty(prop.Name);
                    if (efProp != null)
                    {
                        field.MaxLength = efProp.GetMaxLength();
                        field.AutoGen = efProp.ValueGenerated != ValueGenerated.Never;
                        field.IsNullable = efProp.IsNullable;
                        field.IsForeignKey = efProp.IsForeignKey();
                    }
                }

                fields.Add(field.Name, field);

            }

            parentField.ChildFields = fields;

        }

        private static string GetAttributeDisplayName(PropertyInfo property)
        {
            var atts = property.GetCustomAttributes(
                typeof(DisplayNameAttribute), true);
            if (atts.Length == 0)
                return property.Name.SplitCamelCase();
            return (atts[0] as DisplayNameAttribute).DisplayName;
        }

        private static void ReadPropertyMetadata(PropertyInfo property, MetadataField field)
        {
            var atts = property.GetCustomAttributes(
                typeof(ValidationAttribute), true);

            if (atts.Length > 0)
            {
                for (int i = 0; i < atts.Length; i++)
                {
                    ValidationData validationData = new();
                    validationData.ErrorMessage = (atts[i] as ValidationAttribute).ErrorMessage;
                    switch (atts[i])
                    {
                        case CompareAttribute ca:
                            validationData.ValidationType = ValidationType.Compare;
                            validationData.OtherProperty = ca.OtherProperty;
                            validationData.OtherPropertyDisplayName = ca.OtherPropertyDisplayName;
                            break;
                        case MaxLengthAttribute ma:
                            validationData.ValidationType = ValidationType.MaxLength;
                            validationData.MaxLength = ma.Length;
                            break;
                        case MinLengthAttribute ma:
                            validationData.ValidationType = ValidationType.MinLength;
                            validationData.MinLength = ma.Length;
                            break;
                        case RangeAttribute ra:
                            validationData.ValidationType = ValidationType.Range;
                            validationData.MaxRange = ra.Maximum;
                            validationData.MinRange = ra.Minimum;
                            break;
                        case RegularExpressionAttribute rea:
                            validationData.ValidationType = ValidationType.RegularExpression;
                            validationData.Pattern = rea.Pattern;                            
                            break;
                        case RequiredAttribute:
                            validationData.ValidationType = ValidationType.Required;
                            validationData.IsRequired = true;
                            break;
                        case StringLengthAttribute sa:
                            validationData.ValidationType = ValidationType.MaxLength;
                            validationData.MaxLength = sa.MaximumLength;
                            validationData.MinLength = sa.MinimumLength;
                            break;
                        case EmailAddressAttribute:
                            validationData.ValidationType = ValidationType.Email;
                            validationData.IsEmail = true;
                            break;
                        case PhoneAttribute:
                            validationData.ValidationType = ValidationType.Phone;
                            validationData.IsPhone = true;
                            break;
                        default:
                            continue;
                    }
                    field.Validations.Add(validationData);
                }
            }

            atts = property.GetCustomAttributes(
                typeof(RequiredAttribute), true);

            if (atts.Length > 0)
            {
                field.IsNullable = false;
            }
            else if (property.PropertyType.IsValueType && (Nullable.GetUnderlyingType(property.PropertyType) == null))
            {
                field.IsNullable = false;
            }

            atts = property.GetCustomAttributes(
                typeof(ForeignKeyAttribute), true);

            if (atts.Length > 0)
            {
                if (atts[0] is ForeignKeyAttribute att)
                {
                    field.ForeignKeyName = att.Name;
                    field.IsForeignKey = true;
                }
            }
        }
    }
}
