using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NeoCryptedStorage.DataModels
{
  public class EncryptedFileUpload
  {
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
  }
}
