using BinaryQuest.Framework.Core.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BinaryQuest.Framework.CoreTests.Extensions
{
    [TestClass]
    public class StringExtensionsTests
    {
        [TestMethod]
        public void TrimEnd_RemovesSuffix_WhenSuffixMatches()
        {
            var value = "OrderController";

            var result = value.TrimEnd("Controller");

            Assert.AreEqual("Order", result);
        }

        [TestMethod]
        public void TrimEnd_ReturnsOriginal_WhenSuffixDoesNotMatch()
        {
            var value = "OrderController";

            var result = value.TrimEnd("Service");

            Assert.AreEqual(value, result);
        }

        [TestMethod]
        public void ToCamelCase_ConvertsPascalCaseValue()
        {
            var result = "OrderNumber".ToCamelCase();

            Assert.AreEqual("orderNumber", result);
        }

        [TestMethod]
        public void SplitCamelCase_HandlesMixedTextNumbersAndAcronyms()
        {
            var result = "wordWordIDWord1WordWORDWord32Word2".SplitCamelCase();

            Assert.AreEqual("Word Word ID Word 1 Word WORD Word 32 Word 2", result);
        }

        [TestMethod]
        public void SplitCamelCase_ReturnsNull_WhenInputIsNull()
        {
            string? value = null;

            var result = ConventionBasedFormattingExtensions.SplitCamelCase(value!);

            Assert.IsNull(result);
        }
    }
}


