using BinaryQuest.Framework.Core.Data;
using Duende.IdentityServer.EntityFramework.Options;
using IdentityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bqStart.Data
{
    public class MainDataContext : BQDataContext<ApplicationUser>
    {
        public MainDataContext(DbContextOptions options, Microsoft.Extensions.Options.IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Department>(entity =>
            {
                entity.HasOne(d => d.AddressNavigation)
                    .WithMany(p => p.DepartmentAddressNavigations)
                    .HasForeignKey(d => d.AddressId)
                    .HasConstraintName("FK_Departments_Addresses_AddressId");
            });
        }

        public DbSet<Address> Addresses => Set<Address>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<ExampleClass> ExampleClasses => Set<ExampleClass>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    }
}
