using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class ExampleClass : BaseEntity<int>
    {
        [StringLength(200)]
        [Required]
        public string ClassName { get; set; } = null!;

        [Required]
        public int DepartmentId { get; set; }

        public DateTime? ClassDate { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department? Department { get; set; }

        public bool IsActive { get; set; }
    }
}
