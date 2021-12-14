using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public class UserService<TUser, TDb> : IUserService<TUser, TDb>
        where TDb : BQDataContext<TUser>
        where TUser : BaseUser
    {
        private readonly ILogger logger;
        private readonly IServiceProvider serviceProvider;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly UserManager<TUser> userManager;

        public UserService(ILogger<UserService<TUser, TDb>> logger, IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor, UserManager<TUser> userManager)
        {
            this.logger = logger;
            this.serviceProvider = serviceProvider;
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
        }        

        public TUser? CurrentUser
        {
            get
            {
                TUser? ret = null;
                try
                {
                    if (httpContextAccessor.HttpContext!.User!.Identity!.IsAuthenticated)
                    {
                        using var scope = serviceProvider.CreateScope();                        
                        using var ctx = scope.ServiceProvider.GetRequiredService<TDb>();
                        ret = (from u in ctx.Users
                               where u.UserName == httpContextAccessor.HttpContext.User.Identity.Name
                               select u).FirstOrDefault();
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError("unable to get Current User, exception {ex}",ex);
                    throw;
                }
                return ret;
            }
        }


        public IList<TUser?> GetAllUsers()
        {
            using var scope = serviceProvider.CreateScope();
            using var ctx = scope.ServiceProvider.GetRequiredService<TDb>();
            var list = (from u in ctx.Users
                   where u.UserName == httpContextAccessor!.HttpContext!.User!.Identity!.Name
                   select u).ToList();
            return list;
        }

        public async Task<TUser?> EditAsync(TUser model)
        {
            var user = await userManager.FindByIdAsync(model.Id);
            if (user != null)
            {
                user.FirstName = model.PhoneNumber;
                user.LastName = model.LastName;
                user.PhoneNumber = model.PhoneNumber;
                user.TimeZoneId = model.TimeZoneId;
                await userManager.UpdateAsync(user);
            }
            return user;
        }

        public async Task<TUser?> GetByIdAsync(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user != null)
            {
                await userManager.DeleteAsync(user);
            }
            return user;
        }

        public async Task DeleteAsync(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user != null)
            {
                await userManager.DeleteAsync(user);
            }
        }
    }
}
