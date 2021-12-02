using BinaryQuest.Framework.Core.Data;
using Duende.IdentityServer.EntityFramework.Options;
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
        }
    }
}
