using BinaryQuest.Framework.Core.Data;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
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
                roleClaims.Add(new Claim(ClaimTypes.Role, role));                
            }

            roleClaims.Add(new Claim(JwtClaimTypes.FamilyName, user.LastName ?? string.Empty));
            roleClaims.Add(new Claim(ClaimTypes.Surname, user.LastName ?? string.Empty));

            roleClaims.Add(new Claim(JwtClaimTypes.GivenName, user.FirstName ?? string.Empty));
            roleClaims.Add(new Claim(ClaimTypes.GivenName, user.FirstName ?? string.Empty));

            roleClaims.Add(new Claim(JwtClaimTypes.Locale, "en-UK"));
            roleClaims.Add(new Claim(ClaimTypes.Locality, "en-UK"));

            //add user claims

            roleClaims.Add(new Claim(JwtClaimTypes.Name, user.UserName));
            roleClaims.Add(new Claim(ClaimTypes.Name, user.UserName));
            roleClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            roleClaims.Add(new Claim("timezone", user.TimeZoneId ?? String.Empty));

            context.IssuedClaims.AddRange(roleClaims);
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
