using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BinaryQuest.Framework.Core;

namespace BinaryQuest.Framework.Core.Tests
{
    [TestClass()]
    public class CustomActionAttributeTests
    {
        [TestMethod()]
        public void CustomActionAttributeTest()
        {
            var attributes = (IList<AttributeUsageAttribute>)typeof(CustomActionAttribute).GetCustomAttributes(typeof(AttributeUsageAttribute), false);
            Assert.AreEqual(1, attributes.Count);

            var attribute = attributes[0];
            Assert.IsFalse(attribute.AllowMultiple);
            Assert.IsTrue((attribute.ValidOn & AttributeTargets.Method) == AttributeTargets.Method);
        }
    }
}