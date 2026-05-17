using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Exceptions;
using BinaryQuest.Framework.Core.Implementation;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.CoreTests.Implementation
{
    [TestClass]
    public class UnitOfWorkTests
    {
        [TestMethod]
        public async Task SaveAsync_ThrowsDbEntityValidationException_WhenEntityValidationFails()
        {
            await using var context = TestBQContext.Create();
            using var sut = new UnitOfWork<TestUser>(context);

            context.ValidatableEntities.Add(new ValidatableEntity { Name = string.Empty });

            var exception = await Assert.ThrowsExceptionAsync<DbEntityValidationException>(() => sut.SaveAsync());

            Assert.IsTrue(exception.ValidationResults.Any());
        }

        [TestMethod]
        public async Task SaveAsync_PersistsEntity_WhenValidationPasses()
        {
            await using var context = TestBQContext.Create();
            using var sut = new UnitOfWork<TestUser>(context);

            context.ValidatableEntities.Add(new ValidatableEntity { Name = "valid" });

            await sut.SaveAsync();

            Assert.AreEqual(1, context.ValidatableEntities.Count());
        }

        private sealed class TestBQContext : BQDataContext<TestUser>
        {
            public DbSet<ValidatableEntity> ValidatableEntities => Set<ValidatableEntity>();

            private TestBQContext(DbContextOptions<TestBQContext> options) : base(options)
            {
            }

            public static TestBQContext Create()
            {
                var options = new DbContextOptionsBuilder<TestBQContext>()
                    .UseInMemoryDatabase($"uow-test-{System.Guid.NewGuid()}")
                    .Options;
                return new TestBQContext(options);
            }
        }

        private sealed class TestUser : BaseUser
        {
        }

        private sealed class ValidatableEntity : IValidatableObject
        {
            [Key]
            public int Id { get; set; }

            public string Name { get; set; } = string.Empty;

            public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
            {
                if (string.IsNullOrWhiteSpace(Name))
                {
                    yield return new ValidationResult("Name is required.", new[] { nameof(Name) });
                }
            }
        }
    }
}


