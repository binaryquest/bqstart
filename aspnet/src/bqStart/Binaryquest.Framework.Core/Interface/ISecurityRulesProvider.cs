using BinaryQuest.Framework.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface ISecurityRulesProvider
    {
        List<SecurityRule> GetRules();
    }
}
