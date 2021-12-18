using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Model
{
    public sealed record UserClaimInfo(string? UserId, string? FirstName, string? LastName, string? Locale, string? Timezone)
    {
        public string? FullName { 
            get
            {
                StringBuilder sb = new();
                if (!string.IsNullOrWhiteSpace(FirstName))
                {
                    sb.AppendFormat("{0} ", FirstName);
                }
                if (!string.IsNullOrWhiteSpace(LastName))
                {
                    sb.AppendFormat("{0}", LastName);
                }
                if (string.IsNullOrWhiteSpace(FirstName) && string.IsNullOrWhiteSpace(LastName))
                {
                    sb.AppendFormat("[{0}]", UserId);
                }
                return sb.ToString();
            } 
        }
    }
}
