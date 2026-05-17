using BinaryQuest.Framework.Core.Implementation;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BinaryQuest.Framework.CoreTests.Implementation
{
    [TestClass]
    public class GenericRepositoryTests
    {
        [TestMethod]
        public void GetByID_ReturnsSingleKeyEntity()
        {
            using var context = TestDbContext.Create();
            context.SingleKeyEntities.AddRange(
                new SingleKeyEntity { Id = 1, Name = "A" },
                new SingleKeyEntity { Id = 2, Name = "B" });
            context.SaveChanges();

            var repository = new GenericRepository<SingleKeyEntity>(context);

            var result = repository.GetByID(new object[] { 2 });

            Assert.IsNotNull(result);
            Assert.AreEqual("B", result.Name);
        }

        [TestMethod]
        public void GetByIdQuery_UsesAllThreeCompositeKeys()
        {
            using var context = TestDbContext.Create();
            context.ThreeKeyEntities.AddRange(
                new ThreeKeyEntity { Key1 = 1, Key2 = 1, Key3 = 1, Value = "first" },
                new ThreeKeyEntity { Key1 = 1, Key2 = 1, Key3 = 2, Value = "second" });
            context.SaveChanges();

            var repository = new GenericRepository<ThreeKeyEntity>(context);

            var result = repository.GetByID(new object[] { 1, 1, 2 });

            Assert.IsNotNull(result);
            Assert.AreEqual("second", result.Value);
        }

        [TestMethod]
        public void Get_AppliesFilterAndOrderBy()
        {
            using var context = TestDbContext.Create();
            context.SingleKeyEntities.AddRange(
                new SingleKeyEntity { Id = 1, Name = "zeta" },
                new SingleKeyEntity { Id = 2, Name = "alpha" },
                new SingleKeyEntity { Id = 3, Name = "beta" });
            context.SaveChanges();

            var repository = new GenericRepository<SingleKeyEntity>(context);

            var result = repository.Get(
                filter: x => x.Name != "zeta",
                orderBy: q => q.OrderBy(x => x.Name))
                .ToList();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual("alpha", result[0].Name);
            Assert.AreEqual("beta", result[1].Name);
        }

        private sealed class TestDbContext : DbContext
        {
            public DbSet<SingleKeyEntity> SingleKeyEntities => Set<SingleKeyEntity>();
            public DbSet<ThreeKeyEntity> ThreeKeyEntities => Set<ThreeKeyEntity>();

            private TestDbContext(DbContextOptions<TestDbContext> options) : base(options)
            {
            }

            public static TestDbContext Create()
            {
                var options = new DbContextOptionsBuilder<TestDbContext>()
                    .UseInMemoryDatabase($"repo-test-{System.Guid.NewGuid()}")
                    .Options;
                return new TestDbContext(options);
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<ThreeKeyEntity>()
                    .HasKey(x => new { x.Key1, x.Key2, x.Key3 });
            }
        }

        private sealed class SingleKeyEntity
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public string Name { get; set; } = string.Empty;
        }

        private sealed class ThreeKeyEntity
        {
            public int Key1 { get; set; }
            public int Key2 { get; set; }
            public int Key3 { get; set; }
            public string Value { get; set; } = string.Empty;
        }
    }
}


