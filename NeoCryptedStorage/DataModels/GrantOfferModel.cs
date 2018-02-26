using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoCryptedStorage.DataModels
{
    public class GrantOfferModel
  {
    public string DecryptedFileHash { get; set; }

    public string PasswordSharedSecretEncrypted { get; set; }
  }
}
