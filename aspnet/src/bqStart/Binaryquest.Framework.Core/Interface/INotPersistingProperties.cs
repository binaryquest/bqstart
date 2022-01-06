using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface INotPersistingProperties
    {
        RecordState RecordState { get; set; }
    }
}
