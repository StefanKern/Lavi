using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

namespace Contract42
{
    public class Contract42 : SmartContract
    {
        public static int Main(string name, object[] args)
        {
            return 42;
        }
    }
}
