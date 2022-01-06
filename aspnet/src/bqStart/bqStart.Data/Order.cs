using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class Order : BaseEntity<int>
    {
        public Order()
        {
            Details = new List<OrderDetail>();
        }

        public int OrderDate { get; set; }
        public int Total { get; set; }
        public string CustomerName { get; set; } = null!;
        public virtual ICollection<OrderDetail> Details { get; set; }
    }

    public class OrderDetail : BaseEntity<int>
    {
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
        public int Qty { get; set; }
        public int Price { get; set; }
    }
}
