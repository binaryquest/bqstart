using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Model
{
    public class CachedObjectWrapper<T>
    {
        public string CacheToken { get; set; }

        public T CachedObject { get; set; }
    }
}
