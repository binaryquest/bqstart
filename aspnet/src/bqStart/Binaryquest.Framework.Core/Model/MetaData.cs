using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
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
        [JsonProperty("allowAdd")]
        public bool AllowAdd { get; set; }
        [JsonProperty("allowEdit")]
        public bool AllowEdit { get; set; }
        [JsonProperty("allowDelete")]
        public bool AllowDelete { get; set; }
        [JsonProperty("allowSelect")]
        public bool AllowSelect { get; set; }
        [JsonProperty("typeName")]
        public string TypeName { get; set; }
        [JsonProperty("keys")]
        public List<PrimaryKey> Keys { get; set; }
        [JsonProperty("fields")]
        public Dictionary<string, MetadataField> Fields { get; set; }
    }

    public class PrimaryKey
    {
        public PrimaryKey(string keyName, string keyType)
        {
            this.KeyName = keyName;
            this.KeyType = keyType;
        }
        [JsonProperty("keyName")]
        public string KeyName { get; set; }
        [JsonProperty("keyType")]
        public string KeyType { get; set; }
    }

    public class MetadataField
    {
        public MetadataField()
        {
            Validations = new List<ValidationData>();
        }
        [JsonProperty("name")]
        public string? Name { get; set; }
        [JsonProperty("caption")]
        public string? Caption { get; set; }
        [JsonProperty("dataType")]
        public string? DataType { get; set; }
        [JsonProperty("maxLength")]
        public int? MaxLength { get; set; }
        [JsonProperty("genericDataType")]
        public string? GenericDataType { get; set; }
        [JsonProperty("isNullable")]
        public bool IsNullable { get; set; }
        [JsonProperty("validations")]
        public List<ValidationData> Validations { get; set; }

        [JsonProperty("isForeignKey")]
        public bool IsForeignKey { get; set; }
        [JsonProperty("isPrimaryKey")]
        public bool IsPrimaryKey { get; set; }
        [JsonProperty("autoGen")]
        public bool AutoGen { get; set; }

        [JsonProperty("foreignKeyName")]
        public string? ForeignKeyName { get; set; }

        [JsonProperty("relatedFormViewId")]
        public string? RelatedFormViewId { get; set; }
        [JsonProperty("relatedListViewId")]
        public string? RelatedListViewId { get; set; }
        [JsonProperty("allowRelatedViewSelect")]
        public bool AllowRelatedViewSelect { get; set; }
        [JsonProperty("allowRelatedViewInsert")]
        public bool AllowRelatedViewInsert { get; set; }
        [JsonProperty("childFields")]
        public Dictionary<string, MetadataField>? ChildFields { get; set; }
        [JsonProperty("isEnum")]
        public bool IsEnum { get; set; }
        [JsonProperty("enums")]
        public List<EnumItem>? Enums { get; set; }
    }

    public struct EnumItem
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("name")]
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
        [JsonProperty("validationType")]
        public ValidationType ValidationType { get; set; }
        [JsonProperty("errorMessage")]
        public string? ErrorMessage { get; set; }
        [JsonProperty("otherProperty")]
        public string? OtherProperty { get; set; }
        [JsonProperty("otherPropertyDisplayName")]
        public string? OtherPropertyDisplayName { get; set; }
        [JsonProperty("maxLength")]
        public int? MaxLength { get; set; }
        [JsonProperty("minLength")]
        public int? MinLength { get; set; }
        [JsonProperty("maxRange")]
        public object? MaxRange { get; set; }
        [JsonProperty("minRange")]
        public object? MinRange { get; set; }
        [JsonProperty("pattern")]
        public string? Pattern { get; set; }
        [JsonProperty("isRequired")]
        public bool? IsRequired { get; set; }
        [JsonProperty("isEmail")]
        public bool? IsEmail { get; set; }
        [JsonProperty("isPhone")]
        public bool? IsPhone { get; set; }
    }


}
