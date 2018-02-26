using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

namespace ContractparameterCall
{
    public class Contract : SmartContract
    {
        public static byte[] Main(string name, object[] args)
        {
            if(args != null && args.Length > 0)
            {
                var Hello = new byte[] { 72, 101, 108, 108, 111, 32 };
                var ExclamationMark = new byte[] { 33 };
                return Hello.Concat(args[0] as byte[]).Concat(ExclamationMark);
            }
            else
            {
                return new byte[] { 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33 };
            }
        }
    }
}
