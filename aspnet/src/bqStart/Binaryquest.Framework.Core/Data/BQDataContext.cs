using BinaryQuest.Framework.Core.Interface;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BinaryQuest.Framework.Core.Data
{
    public abstract class BQDataContext<T> : ApiAuthorizationDbContext<T> where T : BaseUser
    {
        public BQDataContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

        public DbSet<SettingKey> SettingKeys => Set<SettingKey>();


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var propertyNames = typeof(INotPersistingProperties).GetProperties()
                                .Select(p => p.Name)
                                .ToList();

            var entityTypes = builder.Model.GetEntityTypes()
                .Where(t => typeof(INotPersistingProperties).IsAssignableFrom(t.ClrType));

            foreach (var entityType in entityTypes)
            {
                var entityTypeBuilder = builder.Entity(entityType.ClrType);
                foreach (var propertyName in propertyNames)
                    entityTypeBuilder.Ignore(propertyName);
            }
        }
    }
}
