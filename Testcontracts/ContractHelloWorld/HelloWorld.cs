using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

namespace HelloWorld
{
    public class ContractHelloWorld : SmartContract
    {
        public static string Main(string name, object[] args)
        {
            return "Hello World!";
        }
    }
}
