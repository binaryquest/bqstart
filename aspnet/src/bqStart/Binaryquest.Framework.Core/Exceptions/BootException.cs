using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Exceptions
{

    [Serializable]
    public class BootException : Exception
    {
        public BootException() { }
        public BootException(string message) : base(message) { }
        public BootException(string message, Exception inner) : base(message, inner) { }
        protected BootException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}
