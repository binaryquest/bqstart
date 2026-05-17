using BinaryQuest.Framework.Core.Interface;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BinaryQuest.Framework.Core.Data
{
    public abstract class BQDataContext<T> : IdentityDbContext<T> where T : BaseUser
    {
        public BQDataContext(DbContextOptions options) : base(options)
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
