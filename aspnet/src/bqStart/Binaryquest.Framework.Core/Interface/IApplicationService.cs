using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface IApplicationService
    {
        Bootdata Bootdata { get; }
        AppConfigOptions ConfigOptions { get; }
        Type UserType { get; }
        Type DbContextType { get; }
    }    
}
