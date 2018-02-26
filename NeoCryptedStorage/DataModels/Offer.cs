using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NeoCryptedStorage.DataModels
{
  public class Offer
  {
    public int EncryptedFileUploadId { get; set; }

    public string CreatorAddressHash { get; set; }
    
    public string OffererAddress { get; set; }

    public string DecryptedFileHash { get; set; }

    public string EncryptedFileHash { get; set; }

    public int? Price { get; set; }

    public int? AvalibeTimeInBlocks { get; set; }

    public DateTime? Time { get; set; }


    // buy an offer
    public bool Open { get; set; }

    public string Buyer { get; set; }

    public bool Granted { get; set; }

    public string PasswordSharedSecretEncrypted { get; set; }
  }
}
