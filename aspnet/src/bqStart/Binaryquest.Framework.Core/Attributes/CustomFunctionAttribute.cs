using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core
{
    [AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
    public sealed class CustomFunctionAttribute : Attribute
    {
        // This is a positional argument
        public CustomFunctionAttribute()
        {

        }
    }
}
