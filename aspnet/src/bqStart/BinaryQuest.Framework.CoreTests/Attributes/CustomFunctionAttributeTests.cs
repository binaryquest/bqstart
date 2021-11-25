using BinaryQuest.Framework.Core;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace BinaryQuest.Framework.Core.Tests
{
    [TestClass]
    public class CustomFunctionAttributeTests
    {
        [TestMethod]
        public void Test_Attribute_Usage()
        {

            var attributes = (IList<AttributeUsageAttribute>)typeof(CustomFunctionAttribute).GetCustomAttributes(typeof(AttributeUsageAttribute), false);
            Assert.AreEqual(1, attributes.Count);

            var attribute = attributes[0];
            Assert.IsFalse(attribute.AllowMultiple);
            Assert.IsTrue((attribute.ValidOn & AttributeTargets.Method) == AttributeTargets.Method);
        }        
    }
}
