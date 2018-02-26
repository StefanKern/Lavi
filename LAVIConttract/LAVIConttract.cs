using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

namespace LAVIConttract
{
    public class LAVIConttract : SmartContract
    {
        // prefixes for differnt operations and validations, that the opertations are executed 
        // in the correct order and from the correct person    
        // prefixes cannot be declare static, because each function Concats with them

        public static object Main(string operation, object[] args)
        {
            if (operation == "OpenOffer")
                return OpenOffer(args);
            if (operation == "TakeOffer")
                return TakeOffer(args);
            if (operation == "GrantOffer")
                return GrantOffer(args);

            if (operation == "GetOpenOffer")
                return GetOpenOffer(args);
            if (operation == "GetTakeOffer")
                return GetTakeOffer(args);
            if (operation == "GetGrantOffer")
                return GetGrantOffer(args);
            else
                return "Error: Invalid Parameter";
        }

        private static object OpenOffer(object[] args)
        {
            byte[] OpenKeyPrefix = new byte[] { 01 };
            byte[] CreatorKeyPrefix = new byte[] { 02 };
            byte[] key = (byte[])args[0];
            byte[] value = (byte[])args[1];
            byte[] from = (byte[])args[2];

            // TODO: can I get the address of the creator from inside the contract
            // if (!Runtime.CheckWitness(from)) return false;

            byte[] storedRequests = Storage.Get(Storage.CurrentContext, key);
            if (storedRequests.Length == 0)
            {
                Storage.Put(Storage.CurrentContext, OpenKeyPrefix.Concat(key), value);
                Storage.Put(Storage.CurrentContext, CreatorKeyPrefix.Concat(key), from);
                return true;
            }
            else
            {
                return false;
            }
        }
        private static object TakeOffer(object[] args)
        {
            byte[] CreatorKeyPrefix = new byte[] { 02 };
            byte[] TakeKeyPrefix = new byte[] { 11 };
            byte[] key = (byte[])args[0];
            byte[] value = (byte[])args[1];

            // check if the contract was already opened
            byte[] created = Storage.Get(Storage.CurrentContext, CreatorKeyPrefix.Concat(key));
            if (created.Length != 0)
            {
                Storage.Put(Storage.CurrentContext, TakeKeyPrefix.Concat(key), value);
                return true;
            }
            else
            {
                return false;
            }
        }

        private static object GrantOffer(object[] args)
        {            
            byte[] CreatorKeyPrefix = new byte[] { 02 };
            byte[] TakeKeyPrefix = new byte[] { 11 };

            byte[] key = (byte[])args[0];
            byte[] value = (byte[])args[1];

            byte[] creator = Storage.Get(Storage.CurrentContext, CreatorKeyPrefix.Concat(key));
            byte[] storedRequests = Storage.Get(Storage.CurrentContext, key);

            // check if the owner calls the GrantOffer mehtod
            // if (!Runtime.CheckWitness(creator)) return false;

            // check if the contract was already opened
            byte[] created = Storage.Get(Storage.CurrentContext, TakeKeyPrefix.Concat(key));
            if (created.Length == 0)
            {
                Storage.Put(Storage.CurrentContext, key, value);
                return true;
            }
            else
            {
                return false;
            }
        }

        private static object GetOpenOffer(object[] args)
        {
            byte[] OpenKeyPrefix = new byte[] { 01 };
            byte[] key = args[0] as byte[];
            byte[] storageValue = Storage.Get(Storage.CurrentContext, OpenKeyPrefix.Concat(key));

            return storageValue;
        }

        private static object GetTakeOffer(object[] args)
        {
            byte[] TakeKeyPrefix = new byte[] { 11 };
            byte[] key = (byte[])args[0];
            byte[] storageValue = Storage.Get(Storage.CurrentContext, TakeKeyPrefix.Concat(key));

            return storageValue;
        }

        private static object GetGrantOffer(object[] args)
        {
            byte[] GrantKeyPrefix = new byte[] { 21 };
            byte[] key = (byte[])args[0];
            byte[] storageValue = Storage.Get(Storage.CurrentContext, GrantKeyPrefix.Concat(key));

            return storageValue;
        }

    }
}
