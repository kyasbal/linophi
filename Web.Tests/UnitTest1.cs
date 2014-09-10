using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Web.Storage;
using Web.Storage.Connection;
using Web.Utility;

namespace Web.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            for (int i = 0; i < 100; i ++)
            {
                Console.WriteLine(IdGenerator.getId(10));
            }
        }
    }
}
