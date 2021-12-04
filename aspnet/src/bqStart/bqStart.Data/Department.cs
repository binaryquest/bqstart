using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class Department : BaseEntity<int>
    {
        [StringLength(150)]
        [Required]
        public string DepartmentName { get; set; } = null!;
    }
}
