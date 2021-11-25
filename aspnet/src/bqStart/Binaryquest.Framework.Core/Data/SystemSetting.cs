using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Data
{
    public class SystemSetting
    {
        [Key]        
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string SettingsName { get; set; }

        public bool IsActive { get; set; }

        public virtual ICollection<SettingKey> Settings { get; set; }
    }
}
