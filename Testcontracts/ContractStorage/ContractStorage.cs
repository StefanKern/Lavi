using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

namespace ContractStorage
{
    public class ContractStorage : SmartContract
    {
        public static object Main(string operation, object[] args)
        {
            Runtime.Notify("Test");
            if (operation == "addStorageRequest")
                return AddStorageRequest(args);
            if (operation == "getPendingRequest")
                return GetPendingRequest(args);

            else
                return "Error: Invalid Parameter";
        }

        private static object AddStorageRequest(object[] args)
        {
            byte[] key = (byte[])args[0];
            byte[] value = (byte[])args[1];

            byte[] storedRequests = Storage.Get(Storage.CurrentContext, key);
            if (storedRequests.Length == 0)
            {
                Storage.Put(Storage.CurrentContext, key, value);
                return true;
            }
            else
            {
                return false;
            }
            
        }

        private static object GetPendingRequest(object[] args)
        {
            byte[] key = (byte[])args[0];
            byte[] storageValue = Storage.Get(Storage.CurrentContext, key);
            
            return storageValue;
        }
    }
}