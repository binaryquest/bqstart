using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace BinaryQuest.Framework.Core.Model
{
    [XmlRoot(ElementName = "securityRule")]
    public class SecurityRule
    {
        [XmlAttribute(AttributeName = "modelType")]
        public string ModelType { get; set; }
        [XmlAttribute(AttributeName = "roleName")]
        public string RoleName { get; set; }
        [XmlAttribute(AttributeName = "allowSelect")]
        public bool AllowSelect { get; set; }
        [XmlAttribute(AttributeName = "allowInsert")]
        public bool AllowInsert { get; set; }
        [XmlAttribute(AttributeName = "allowUpdate")]
        public bool AllowUpdate { get; set; }
        [XmlAttribute(AttributeName = "allowDelete")]
        public bool AllowDelete { get; set; }
    }

    [XmlRoot(ElementName = "securityRules")]
    public class SecurityRules
    {
        [XmlElement(ElementName = "securityRule")]
        public List<SecurityRule> SecurityRule { get; set; }


        #region Serialize
        /// <summary>
        /// Serializes the specified document. Unicode is used
        /// </summary>
        /// <param name="document">The document.</param>
        /// <returns></returns>
        public static string Serialize(SecurityRules document)
        {
            return Serialize(document, Encoding.Unicode);
        }

        /// <summary>
        /// Serializes the specified document to xml string.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="encoding">The encoding.</param>
        /// <returns></returns>
        public static string Serialize(SecurityRules document, System.Text.Encoding encoding)
        {
            StringBuilder xml = new StringBuilder();

            using (MemoryStream ms = new MemoryStream())
            {
                StreamWriter sw = new StreamWriter(ms, encoding);

                XmlSerializer serializer = new XmlSerializer(typeof(SecurityRules));
                serializer.Serialize(sw, document);
                StreamReader sr = new StreamReader(ms, encoding);

                sw.Flush();
                ms.Position = 0;

                xml.Append(sr.ReadToEnd());

                sw.Close();
                sr.Close();
                ms.Close();
            }

            return xml.ToString();
        }
        #endregion

        #region Deserialize
        /// <summary>
        /// Deserializes the specified XML data to Document.
        /// </summary>
        /// <param name="xmlData">The XML data.</param>
        /// <returns></returns>
        public static SecurityRules Deserialize(string xmlData)
        {
            StringReader sr = new StringReader(xmlData);
            XmlSerializer serializer = new XmlSerializer(typeof(SecurityRules));
            SecurityRules doc = (SecurityRules)serializer.Deserialize(sr);
            sr.Close();
            return doc;
        }
        #endregion
    }
}
