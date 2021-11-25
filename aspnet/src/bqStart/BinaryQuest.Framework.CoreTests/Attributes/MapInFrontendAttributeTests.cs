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
    public class MapInFrontendAttributeTests
    {
        [TestMethod()]
        public void MapInFrontendAttributeTest()
        {
            var attributes = (IList<AttributeUsageAttribute>)typeof(MapInFrontendAttribute).GetCustomAttributes(typeof(AttributeUsageAttribute), false);
            Assert.AreEqual(1, attributes.Count);
            
            var attribute = attributes[0];
            
            Assert.IsTrue(attribute.AllowMultiple);
            Assert.IsTrue((attribute.ValidOn & AttributeTargets.Property) == AttributeTargets.Property);
            Assert.IsTrue((attribute.ValidOn & AttributeTargets.Field) == AttributeTargets.Field);
            Assert.IsFalse((attribute.ValidOn & AttributeTargets.Class) == AttributeTargets.Class);
        }
    }
}