using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Exceptions
{
    public class DbEntityValidationException : Exception
    {
        public IEnumerable<ValidationResult> ValidationResults { get; set; }
        public DbEntityValidationException()
        {
            ValidationResults = new List<ValidationResult>();
        }

        public DbEntityValidationException(IEnumerable<ValidationResult> validationResults)
        {
            ValidationResults = validationResults;
        }

        public DbEntityValidationException(string message) : base(message)
        {
            ValidationResults = new List<ValidationResult>();
        }

        public DbEntityValidationException(string message, Exception innerException) : base(message, innerException)
        {
            ValidationResults = new List<ValidationResult>();
        }

        protected DbEntityValidationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
            ValidationResults = new List<ValidationResult>();
        }

        public string ValidationResultsAsString()
        {
            if (ValidationResults == null)
                return string.Empty;
            StringBuilder sb = new();
            foreach (var item in ValidationResults)
            {
                if (item.ErrorMessage!=null)
                    sb.AppendFormat("{0}\r\n", item.ErrorMessage);
            }
            return sb.ToString();
        }
    }
}
