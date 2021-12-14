using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Model
{
    public class ModelMetadata
    {
        public ModelMetadata(string typeName, List<PrimaryKey> keys, Dictionary<string, MetadataField> fields)
        {
            this.TypeName = typeName;
            this.Keys = keys;
            this.Fields = fields;
        }

        public bool AllowAdd { get; set; }
        public bool AllowEdit { get; set; }
        public bool AllowDelete { get; set; }

        public bool AllowSelect { get; set; }

        public string TypeName { get; set; }

        public List<PrimaryKey> Keys { get; set; }

        public Dictionary<string, MetadataField> Fields { get; set; }
    }

    public class PrimaryKey
    {
        public PrimaryKey(string keyName, string keyType)
        {
            this.KeyName = keyName;
            this.KeyType = keyType;
        }

        public string KeyName { get; set; }
        public string KeyType { get; set; }
    }

    public class MetadataField
    {
        public MetadataField()
        {
            Validations = new List<ValidationData>();
        }

        public string? Name { get; set; }
        public string? Caption { get; set; }
        public string? DataType { get; set; }
        public int? MaxLength { get; set; }
        public string? GenericDataType { get; set; }
        public bool IsNullable { get; set; }
        public List<ValidationData> Validations { get; set; }

        public bool IsForeignKey { get; set; }
        public bool IsPrimaryKey { get; set; }
        public bool AutoGen { get; set; }

        public string? ForeignKeyName { get; set; }

        public string? RelatedFormViewId { get; set; }

        public string? RelatedListViewId { get; set; }

        public bool AllowRelatedViewSelect { get; set; }

        public bool AllowRelatedViewInsert { get; set; }

        public Dictionary<string, MetadataField>? ChildFields { get; set; }

        public bool IsEnum { get; set; }

        public List<EnumItem>? Enums { get; set; }
    }

    public struct EnumItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public enum ValidationType
    {
        Required,
        MaxLength,
        MinLength,
        Range,
        RegularExpression,
        Compare,
        Email,
        Phone
    }

    public class ValidationData 
    {
        public ValidationType ValidationType { get; set; }
        public string? ErrorMessage { get; set; }
        public string? OtherProperty { get; set; }
        public string? OtherPropertyDisplayName { get; set; }
        public int? MaxLength { get; set; }
        public int? MinLength { get; set; }
        public object? MaxRange { get; set; }
        public object? MinRange { get; set; }
        public string? Pattern { get; set; }
        public bool? IsRequired { get; set; }
        public bool? IsEmail { get; set; }
        public bool? IsPhone { get; set; }
    }


}
