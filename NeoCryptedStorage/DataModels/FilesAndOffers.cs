using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NeoCryptedStorage.DataModels
{
  public class FilesAndOffers
  {
    public FilesAndOffers()
    {

    }

    public FilesAndOffers(Offer offer, EncryptedFileUpload file)
    {
      this.Title = file.Title;
      this.EncryptedData = "";
      this.EncryptedPassword = file.EncryptedPassword;
      this.MimeType = file.MimeType;
      this.Uploader = file.Uploader;
      this.UploadTime = file.UploadTime;
      this.DecryptedFileHash = file.DecryptedFileHash;
      this.EncryptedFileHash = file.EncryptedFileHash;
      this.CreatorAddressHash = offer.CreatorAddressHash;
      this.OffererAddress = offer.OffererAddress;
      this.Time = offer.Time;
      this.Open = offer.Open;
      this.BuyerAddressHash = offer.Buyer;
      this.Granted = offer.Granted;
      this.PasswordSharedSecretEncrypted = offer.PasswordSharedSecretEncrypted;
    }

    public string Title { get; set; }

    // date is encrypted with the password
    public string EncryptedData { get; set; }

    // password is encrypted with the users WIF 
    public string EncryptedPassword { get; set; }

    public string MimeType { get; set; }

    public string Uploader { get; set; }

    public DateTime? UploadTime { get; set; }

    public string DecryptedFileHash { get; set; }

    public string EncryptedFileHash { get; set; }

    public string CreatorAddressHash { get; set; }

    public string OffererAddress { get; set; }
    
    public DateTime? Time { get; set; }


    // buy an offer
    public bool Open { get; set; }

    public string BuyerAddressHash { get; set; }

    public bool Granted { get; set; }

    public string PasswordSharedSecretEncrypted { get; set; }
  }
}
