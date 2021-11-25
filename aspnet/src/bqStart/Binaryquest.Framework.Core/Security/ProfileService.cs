using BinaryQuest.Framework.Core.Data;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Security
{
    public class ProfileService<T> : IProfileService where T:BaseUser
    {
        protected readonly UserManager<T> _userManager;


        public ProfileService(UserManager<T> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            BaseUser user = await _userManager.GetUserAsync(context.Subject);

            IList<string> roles = await _userManager.GetRolesAsync((T)user);

            IList<Claim> roleClaims = new List<Claim>();
            foreach (string role in roles)
            {
                roleClaims.Add(new Claim(JwtClaimTypes.Role, role));
                //roleClaims.Add(new Claim(JwtClaimTypes.Role, "user1"));
            }
            roleClaims.Add(new Claim(JwtClaimTypes.FamilyName, user.LastName ?? string.Empty));
            roleClaims.Add(new Claim(JwtClaimTypes.GivenName, user.FirstName ?? string.Empty));

            roleClaims.Add(new Claim(JwtClaimTypes.Locale, "en-UK"));

            //add user claims

            roleClaims.Add(new Claim(JwtClaimTypes.Name, user.UserName));
            context.IssuedClaims.AddRange(roleClaims);
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
