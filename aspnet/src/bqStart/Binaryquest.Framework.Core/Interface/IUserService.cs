using BinaryQuest.Framework.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface IUserService<TUser, TDb> 
        where TDb : BQDataContext<TUser> 
        where TUser : BaseUser
    {
        TUser CurrentUser { get; }
        IList<TUser> GetAllUsers();        
        Task<TUser> EditAsync(TUser model);
        Task DeleteAsync(string id);
        Task<TUser> GetByIdAsync(string id);
    }
}
