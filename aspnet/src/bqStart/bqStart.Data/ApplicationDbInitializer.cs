using BinaryQuest.Framework.Core.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public sealed class ApplicationDbInitializer
    {

        public static async Task CreateRole(RoleManager<IdentityRole> roleManager, ILogger<ApplicationDbInitializer> logger, string role)
        {
            logger.LogInformation("Create the role `{role}` for application", role);

            var exists = await roleManager.FindByNameAsync(role);
            if (exists != null)
                return;

            IdentityResult result = await roleManager.CreateAsync(new IdentityRole(role));
            if (result.Succeeded)
            {
                logger.LogDebug("Created the role `{role}` successfully", role);
            }
            else
            {
                ApplicationException exception = new($"Default role `{role}` cannot be created");
                logger.LogError("Default role `{role}` cannot be created", role);
                throw exception;
            }
        }

        public static async Task<ApplicationUser> CreateDefaultUser(IApplicationService applicationService, UserManager<ApplicationUser> userManager, ILogger<ApplicationDbInitializer> logger, string email, string defaultPassword, string defaultRole)
        {
            logger.LogInformation("Create default user with email `{email}` for application", email);

            ApplicationUser createdUser = await userManager.FindByEmailAsync(email);
            if (createdUser != null)
            {
                return createdUser;
            }

            ApplicationUser user = new()
            {
                FirstName = "Super",
                LastName = "Admin",
                Email = email,
                UserName = email,
                EmailConfirmed = true,
                TimeZoneInfo = applicationService.ConfigOptions.DefaultTimeZone
            };

            IdentityResult identityResult = await userManager.CreateAsync(user, defaultPassword);

            if (identityResult.Succeeded)
            {
                logger.LogDebug("Created default user `{email}` successfully", email);

                await userManager.AddToRoleAsync(user, defaultRole);
            }
            else
            {
                ApplicationException exception = new($"Default user `{email}` cannot be created");
                logger.LogError("Default user `{email}` cannot be created", email);
                throw exception;
            }

            createdUser = await userManager.FindByEmailAsync(email);
            return createdUser;
        }


        public static async Task Initialize(IApplicationService applicationService, MainDataContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<ApplicationDbInitializer> dbInitializerLogger, IConfiguration configuration)
        {
            context.Database.Migrate();

            //context.ExampleClasses.Add(new ExampleClass() { ClassName="Test1", ClassDate=DateTime.UtcNow.Date, DepartmentId = 1  });
            //await context.SaveChangesAsync();

            var defaultPassword = configuration["defaultPassword"] ?? "QWERTY123";
            var defaultLogin = configuration["defaultLoginEmail"] ?? "info@binaryquest.com";
            var defaultRole = configuration["defaultAdminRole"] ?? "Admin";
            await CreateRole(roleManager, dbInitializerLogger, defaultRole);
            await CreateDefaultUser(applicationService, userManager, dbInitializerLogger, defaultLogin, defaultPassword, defaultRole);

        }
    }
}
