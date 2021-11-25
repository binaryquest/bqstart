using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using TimeZoneConverter;

namespace BinaryQuest.Framework.Core.Data
{
    public abstract class BaseUser : IdentityUser
    {
        protected string _timeZoneId;
        protected TimeZoneInfo _timeZoneInfo;

        public BaseUser()
        {
            this._timeZoneInfo = TZConvert.GetTimeZoneInfo("UTC");
        }

        [StringLength(255)]
        [Required]
        public string FirstName { get; set; }

        [StringLength(255)]
        [Required]
        public string LastName { get; set; }

        [MaxLength(100)]
        public string TimeZoneId
        {
            get
            {
                return _timeZoneId;
            }
            set
            {
                _timeZoneId = value;
                if (value != null)
                {
                    _timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(value);
                }
            }
        }

        [NotMapped]
        public TimeZoneInfo TimeZoneInfo
        {
            get { return _timeZoneInfo; }
            set { _timeZoneInfo = value; }
        }


        [NotMapped]
        public string Password { get; set; }

        [NotMapped]
        public string RoleId { get; set; }

        [NotMapped]        
        public string MailAddress { get; set; }
        
        public string FullName()
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
                sb.AppendFormat("[{0}]", UserName);
            }
            return sb.ToString();
        }
    }
}
