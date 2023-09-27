using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class Address : BaseEntity<int>
    {
        [StringLength(500)]
        public string? AddressLine1 { get; set; }

        [StringLength(500)]
        public string? City { get; set; }

        [StringLength(500)]
        [DefaultValue("N/A")]
        public string? Country { get; set; }

        [InverseProperty(nameof(Department.AddressNavigation))]
        public virtual ICollection<Department>? DepartmentAddressNavigations { get; set; }
    }
}
