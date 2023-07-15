using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class ApplicationUser : BaseUser
    {
        public string TestName
        {
            get
            {
                return "Test";
            }
        }
    }
}
