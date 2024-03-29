﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Data
{
    public class SettingKey
    {
        [Key]        
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string? Key { get; set; }

        [Required]
        public Guid SystemSettingId { get; set; }

        [Required]
        public string? Value { get; set; }

        [Required]
        [StringLength(50)]
        public string? DisplayName { get; set; }

        [ForeignKey("SystemSettingId")]
        public virtual SystemSetting? SystemSetting { get; set; }

        public int GetValueAsInt()
        {
            _ = int.TryParse(Value, out int ret);
            return ret;
        }

        public long GetValueAsLong()
        {
            _ = long.TryParse(Value, out long ret);
            return ret;
        }

        public bool GetValueAsBool()
        {
            if (string.IsNullOrWhiteSpace(Value))
                return false;
            else if (Value.ToLower().Trim() == "true" || Value.ToLower().Trim() == "yes")
                return true;
            else
                return false;
        }        
    }
}
