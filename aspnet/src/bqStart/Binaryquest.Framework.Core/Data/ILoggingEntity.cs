using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Data
{
    public interface ILoggingEntity
    {
        DateTime? CreatedOn { get; set; }
        DateTime? ModifiedOn { get; set; }
        string CreatedBy { get; set; }
        string ModifiedBy { get; set; }
    }
}
