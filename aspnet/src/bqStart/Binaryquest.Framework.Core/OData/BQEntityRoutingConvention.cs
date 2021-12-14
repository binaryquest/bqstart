using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Routing;
using Microsoft.AspNetCore.OData.Routing.Conventions;
using Microsoft.AspNetCore.OData.Routing.Template;
using Microsoft.AspNetCore.Routing;
using Microsoft.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.UriParser;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.OData
{
    public class BQEntityRoutingConvention : IODataControllerActionConvention
    {
        public virtual int Order => -100;

        public bool AppliesToController(ODataControllerActionContext context)
        {
            if (context == null)
            {
                throw Error.ArgumentNull(nameof(context));
            }

            return context.EntitySet != null;
        }

        /// <summary>
        /// Apply to action,.
        /// </summary>
        /// <param name="context">Http context.</param>
        /// <returns>true/false</returns>
        public bool AppliesToAction(ODataControllerActionContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            ActionModel action = context.Action;
            IEdmEntitySet entitySet = context.EntitySet;
            IEdmEntityType entityType = entitySet.EntityType();
            

            // if the action has no key parameter, skip it.
            if (!HasODataKeyParameter(action, entityType))
            {
                return false;
            }

            //our customisation only applicable for composite keys entities
            if (entityType.Key().Count() <= 1)
                return false;

            string actionName = action.ActionMethod.Name;

            // We care about the action in this pattern: {HttpMethod}{EntityTypeName}
            (string? httpMethod, string? castTypeName) = Split(actionName);
            if (httpMethod == null)
            {
                return false;
            }

            IEdmStructuredType? castType = null;
            if (castTypeName != null)
            {
                castType = FindTypeInInheritance(entityType, context.Model, castTypeName);
                if (castType == null)
                {
                    return false;
                }
            }

            AddSelector(entitySet, entityType, castType, context.Prefix, context.Model, action, httpMethod, context.Options?.RouteOptions);
            return true; // apply to all controller
        }

        public static bool HasODataKeyParameter(ActionModel action, IEdmEntityType entityType, string keyPrefix = "key")
        {
            if (action == null)
            {
                throw Error.ArgumentNull(nameof(action));
            }

            if (entityType == null)
            {
                throw Error.ArgumentNull(nameof(entityType));
            }

            // TODO: shall we make sure the type is matching?
            var keys = entityType.Key().ToArray();
            if (keys.Length == 1)
            {
                // one key
                return action.Parameters.Any(p => p.ParameterInfo.Name == keyPrefix);
            }
            else
            {
                int i = 1;
                // multipe keys
                foreach (var key in keys)
                {
                    string keyName = $"{keyPrefix}{i++}";
                    if (!action.Parameters.Any(p => p.ParameterInfo.Name == keyName))
                    {
                        return false;
                    }
                }

                return true;
            }
        }

        private static IEdmStructuredType? FindTypeInInheritance(IEdmStructuredType structuralType, IEdmModel model, string typeName)
        {
            IEdmStructuredType baseType = structuralType;
            while (baseType != null)
            {
                if (GetName(baseType) == typeName)
                {
                    return baseType;
                }

                baseType = baseType.BaseType;
            }

            return model.FindAllDerivedTypes(structuralType).FirstOrDefault(c => GetName(c) == typeName);
        }

        private static string GetName(IEdmStructuredType type)
        {
            if (type is IEdmEntityType entityType)
            {
                return entityType.Name;
            }

            return ((IEdmComplexType)type).Name;
        }

        private static (string?, string?) Split(string? actionName)
        {
            string typeName;
            string methodName;

            if (actionName == null)
            {
                return (null,null);
            }

            if (actionName.StartsWith("Get", StringComparison.Ordinal))
            {
                typeName = actionName[3..];
                methodName = "Get";
            }
            else if (actionName.StartsWith("Put", StringComparison.Ordinal))
            {
                typeName = actionName[3..];
                methodName = "Put";
            }
            else if (actionName.StartsWith("Patch", StringComparison.Ordinal))
            {
                typeName = actionName[5..];
                methodName = "Patch";
            }
            else if (actionName.StartsWith("Delete", StringComparison.Ordinal))
            {
                typeName = actionName[6..];
                methodName = "Delete";
            }
            else
            {
                return (null, null);
            }

            if (string.IsNullOrEmpty(typeName))
            {
                return (methodName, null);
            }

            return (methodName, typeName);
        }

        private static void AddSelector(IEdmEntitySet entitySet, IEdmEntityType entityType,
            IEdmStructuredType? castType, string prefix, IEdmModel model, ActionModel action, string httpMethod, ODataRouteOptions? options)
        {
            IList<ODataSegmentTemplate> segments = new List<ODataSegmentTemplate>
            {
                new EntitySetSegmentTemplate(entitySet),
                MyKeySegmentTemplate.CreateKeySegment(entityType, entitySet)
            };

            // If we have the type cast
            if (castType != null)
            {
                if (castType == entityType)
                {
                    // If cast type is the entity type of the entity set.
                    // we support two templates
                    // ~/Customers({key})
                    action.AddSelector(httpMethod, prefix, model, new ODataPathTemplate(segments), options);

                    // ~/Customers({key})/Ns.Customer
                    segments.Add(new CastSegmentTemplate(castType, entityType, entitySet));
                    action.AddSelector(httpMethod, prefix, model, new ODataPathTemplate(segments), options);
                }
                else
                {
                    // ~/Customers({key})/Ns.VipCustomer
                    segments.Add(new CastSegmentTemplate(castType, entityType, entitySet));
                    action.AddSelector(httpMethod, prefix, model, new ODataPathTemplate(segments), options);
                }
            }
            else
            {
                // ~/Customers({key})
                action.AddSelector(httpMethod, prefix, model, new ODataPathTemplate(segments), options);
            }
        }
    }

    public class MyKeySegmentTemplate : ODataSegmentTemplate
    {
        public MyKeySegmentTemplate(IDictionary<string, string> keys, IEdmEntityType entityType, IEdmNavigationSource navigationSource)
        {
            if (keys == null)
            {
                throw Error.ArgumentNull(nameof(keys));
            }

            EntityType = entityType ?? throw Error.ArgumentNull(nameof(entityType));
            NavigationSource = navigationSource;

            KeyMappings = BuildKeyMappings(keys.Select(kvp => new KeyValuePair<string, object>(kvp.Key, kvp.Value)), entityType);

            //int i = 1;
            if (KeyMappings != null)
            {
                if (KeyMappings.Count == 1)
                {
                    Literal = $"{{{KeyMappings.First().Value}}}";
                }
                else
                {
                    Literal = string.Join(",", KeyMappings.Select(a => $"{a.Key}={{{a.Value}}}"));
                }
            }
        }

        public MyKeySegmentTemplate(KeySegment segment)
        {
            if (segment == null)
            {
                throw Error.ArgumentNull(nameof(segment));
            }

            NavigationSource = segment.NavigationSource;
            EntityType = segment.EdmType as IEdmEntityType;

            KeyMappings = BuildKeyMappings(segment.Keys, EntityType);

            int i = 1;
            Literal = KeyMappings!.Count == 1 ?
                $"{{{KeyMappings.First().Value}}}" :
                string.Join(",", KeyMappings.Select(a => $"key{i++}={{{a.Value}}}"));
        }

        /// <summary>
        /// Gets the dictionary representing the mappings from the key names in the current key segment to the 
        /// key names in route data.
        /// the key in dict could be the string used in request
        /// the value in dict could be the string used in action of controller
        /// </summary>
        public IDictionary<string, string>? KeyMappings { get; }

        /// <inheritdoc />
        public string? Literal { get; }

        /// <inheritdoc />
        //public override IEdmType EdmType => EntityType;

        /// <inheritdoc />
        public IEdmNavigationSource NavigationSource { get; }

        /// <summary>
        /// Gets the entity type declaring this key.
        /// </summary>
        public IEdmEntityType? EntityType { get; }

        /// <summary>
        /// Gets the key count
        /// </summary>
        public int Count => KeyMappings!.Count;

        /// <inheritdoc />
        //public override ODataSegmentKind Kind => ODataSegmentKind.Key;

        /// <inheritdoc />
        //public override bool IsSingle => true;

        /// <inheritdoc />
        public override bool TryTranslate(ODataTemplateTranslateContext context)
        {
            if (context == null)
            {
                throw Error.ArgumentNull(nameof(context));
            }

            RouteValueDictionary routeValues = context.RouteValues;
            RouteValueDictionary updateValues = context.UpdatedValues;

            IDictionary<string, object> keysValues = new Dictionary<string, object>();
            int i = 1;
            foreach (var key in KeyMappings!)
            {
                string keyName = key.Key;
                string templateName = key.Value;

                IEdmProperty keyProperty = EntityType!.Key().FirstOrDefault(k => k.Name == keyName)!;
                Contract.Assert(keyProperty != null);

                IEdmTypeReference edmType = keyProperty.Type;
                if (routeValues.TryGetValue(templateName, out object? rawValue))
                {
                    string? strValue = rawValue as string;
                    string newStrValue = context.GetParameterAliasOrSelf(strValue);
                    if (newStrValue != strValue)
                    {
                        updateValues[templateName] = newStrValue;
                        strValue = newStrValue;
                    }

                    object newValue = ODataUriUtils.ConvertFromUriLiteral(strValue, ODataVersion.V4, context.Model, edmType);

                    // for non FromODataUri, so update it, for example, remove the single quote for string value.
                    updateValues[templateName] = newValue;

                    // For FromODataUri, let's refactor it later.
                    string prefixName = ODataParameterValue.ParameterValuePrefix + templateName;
                    updateValues[prefixName] = new ODataParameterValue(newValue, edmType);

                    if (keyName != "key")
                    {
                        keysValues["key" + i++] = newValue;
                        keysValues[keyName] = newValue;
                    }
                    else
                    {
                        keysValues[keyName] = newValue;
                    }
                }
            }

            context.Segments.Add(new KeySegment(keysValues, EntityType, NavigationSource));
            return true;
        }

        internal static MyKeySegmentTemplate CreateKeySegment(IEdmEntityType entityType, IEdmNavigationSource navigationSource, string keyPrefix = "key")
        {
            if (entityType == null)
            {
                throw Error.ArgumentNull(nameof(entityType));
            }

            IDictionary<string, string> keyTemplates = new Dictionary<string, string>();
            var keys = entityType.Key().ToArray();
            if (keys.Length == 1)
            {
                // Id={key}
                keyTemplates[keys[0].Name] = $"{{{keyPrefix}}}";
            }
            else
            {
                int i = 1;
                // Id1={keyId1},Id2={keyId2}
                foreach (var key in keys)
                {
                    keyTemplates[key.Name] = $"{{{keyPrefix}{i++}}}";
                }
            }

            return new MyKeySegmentTemplate(keyTemplates, entityType, navigationSource);
        }

        internal static IDictionary<string, string>? BuildKeyMappings(IEnumerable<KeyValuePair<string, object>> keys, IEdmEntityType? entityType)
        {
            //Contract.Assert(keys != null);
            //Contract.Assert(entityType != null);

            if (entityType == null || keys == null)
                return null;

            Dictionary<string, string> parameterMappings = new();

            int count = keys.Count();
            ISet<string> entityTypeKeys = entityType.Key().Select(c => c.Name).ToHashSet();
            if (count != entityTypeKeys.Count)
            {
                throw new ODataException(Error.Format("%1 %2", count, entityTypeKeys.Count));
            }

            int i = 1;
            foreach (KeyValuePair<string, object> key in keys)
            {
                string keyName = "key" + i++; // key.Key;

                // key name is case-sensitive
                if (!entityTypeKeys.Contains(key.Key))
                {
                    throw new ODataException(Error.Format("%1 %2", keyName, entityType.FullName()));
                }

                string? nameInRouteData;

                if (key.Value is UriTemplateExpression uriTemplateExpression)
                {
                    nameInRouteData = uriTemplateExpression.LiteralText.Trim();
                }
                else
                {
                    // just for easy construct the key segment template
                    // it must start with "{" and end with "}"
                    nameInRouteData = key.Value as string;
                }

                if (nameInRouteData == null)
                {
                    throw new ODataException(Error.Format("%1 %2", key.Value, key.Key));
                }

                nameInRouteData = nameInRouteData[1..^1];
                if (string.IsNullOrEmpty(nameInRouteData))
                {
                    throw new ODataException(Error.Format("%1 %2", key.Value, key.Key));
                }

                parameterMappings[key.Key] = nameInRouteData;
            }

            return parameterMappings;
        }

        public override IEnumerable<string> GetTemplates(ODataRouteOptions options)
        {
            //options = options ?? ODataRouteOptions.Default;

            Contract.Assert(options.EnableKeyInParenthesis || options.EnableKeyAsSegment);

            if (options.EnableKeyInParenthesis && options.EnableKeyAsSegment)
            {
                yield return $"({Literal})";
                yield return $"/{Literal}";
            }
            else if (options.EnableKeyInParenthesis)
            {
                yield return $"({Literal})";
            }
            else if (options.EnableKeyAsSegment)
            {
                yield return $"/{Literal}";
            }
        }
    }

    internal static class Error
    {
        /// <summary>
        /// Formats the specified resource string using <see cref="CultureInfo.CurrentCulture"/>.
        /// </summary>
        /// <param name="format">A composite format string.</param>
        /// <param name="args">An object array that contains zero or more objects to format.</param>
        /// <returns>The formatted string.</returns>
        internal static string Format(string format, params object[] args)
        {
            return String.Format(CultureInfo.CurrentCulture, format, args);
        }

        internal static ArgumentNullException ArgumentNull(string parameterName)
        {
            return new ArgumentNullException(parameterName);
        }
    }
}
