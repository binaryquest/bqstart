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
    public class Department : BaseEntity<int>
    {
        [StringLength(150)]
        [Required]
        public string DepartmentName { get; set; } = null!;

        public int? AddressId { get; set; }

        [InverseProperty(nameof(Address.DepartmentAddressNavigations))]
        public virtual Address? AddressNavigation { get; set; }
    }
}
