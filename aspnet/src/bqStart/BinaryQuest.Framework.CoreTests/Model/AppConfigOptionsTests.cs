using BinaryQuest.Framework.Core.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace BinaryQuest.Framework.CoreTests.Model
{
    [TestClass]
    public class AppConfigOptionsTests
    {
        [TestMethod]
        public void SetDefaultAdminRole_Throws_WhenRoleIsNullOrEmpty()
        {
            var options = AppConfigOptions.Default;

            Assert.ThrowsException<ArgumentNullException>(() => options.SetDefaultAdminRole(string.Empty));
        }

        [TestMethod]
        public void SetDefaultAdminRole_UpdatesValue_WhenRoleIsValid()
        {
            var options = AppConfigOptions.Default;

            options.SetDefaultAdminRole("SuperAdmin");

            Assert.AreEqual("SuperAdmin", options.DefaultAdminRole);
        }

        [TestMethod]
        public void SetApplicationName_FallsBackToDefault_WhenNull()
        {
            var options = AppConfigOptions.Default;

            options.SetApplicationName(null!);

            Assert.AreEqual("BQ Framework App", options.ApplicationName);
        }
    }
}


