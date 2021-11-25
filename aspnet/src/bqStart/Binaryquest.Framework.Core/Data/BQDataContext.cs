using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace BinaryQuest.Framework.Core.Data
{
    public abstract class BQDataContext<T> : ApiAuthorizationDbContext<T> where T:BaseUser
    {
        public BQDataContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<SystemSetting> SystemSettings { get; set; }

        public DbSet<SettingKey> SettingKeys { get; set; }

    }
}
