using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinqToDB;
using LinqToDB.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using NeoCryptedStorage.DataModels;
using NeoCryptedStorage.SettingModels;

namespace NeoCryptedStorage.Api
{
  [Produces("application/json")]
  [Route("api/fileandoffer")]
  public class FilesAndOffersAPIController : Controller
  {
    private readonly IOptions<SQLSettings> _sqlSettingss;
    protected readonly DataConnection DataContext;

    public FilesAndOffersAPIController(IOptions<SQLSettings> sqlSettings)
    {
      _sqlSettingss = sqlSettings;
      DataContext = new DataConnection(ProviderName.SqlServer, _sqlSettingss.Value.ConnectionString);
    }

    [HttpGet()]
    public IActionResult GetOffers()
    {
      var results =
          from offer in DataContext.GetTable<Offer>()
          join file in DataContext.GetTable<EncryptedFileUpload>()
          on offer.DecryptedFileHash equals file.DecryptedFileHash
          select new FilesAndOffers(offer, file);
      return Ok(results);
    }

    // https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api#getting-to-do-items
    [HttpPut("open")]
    public IActionResult AddFile([FromBody] FilesAndOffers fileAndOffer)
    {
      fileAndOffer.UploadTime = DateTime.Now;
      fileAndOffer.Open = true;

      var id = DataContext.Insert(fileAndOffer);

      return Ok(id);
    }


    // https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api#getting-to-do-items
    [HttpGet("take")]
    public IActionResult GetTakeList()
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Take(100)
        .Where(order => order.Open)
        .Select(item => new
        {
          item.Title,
          item.DecryptedFileHash,
          item.CreatorAddressHash
        });
      return Ok(results);
    }
    
    
    [HttpPost("take")]
    public IActionResult TakeOffer([FromBody] BuyModel buyModel)
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Where(offer => offer.DecryptedFileHash == buyModel.DecryptedFileHash)
        .Set(offer => offer.BuyerAddressHash, buyModel.BuyerAddressHash)
        .Set(offer => offer.Open, false)
        .Update();
      return Ok("OK");
    }

    [HttpGet("yourFiles/{CreatorAddressHash}")]
    public IActionResult YourFiles(string CreatorAddressHash)
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Where(offer => offer.BuyerAddressHash == CreatorAddressHash)
        .Take(100);
      return Ok(results);
    }

    [HttpGet("grant/{CreatorAddressHash}")]
    public IActionResult grantOffers(string CreatorAddressHash)
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Where(order => order.CreatorAddressHash == CreatorAddressHash &&  !order.Open && !order.Granted)
        .Take(100)
        .Select(item => new
        {
          item.Title,
          item.DecryptedFileHash,
          item.EncryptedPassword,
          item.BuyerAddressHash
        });
      return Ok(results);
    }

    [HttpPost("grant")]
    public IActionResult grantOffers([FromBody] GrantOfferModel grantOfferModel)
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Where(offer => offer.DecryptedFileHash == grantOfferModel.DecryptedFileHash)
        .Set(offer => offer.PasswordSharedSecretEncrypted, grantOfferModel.PasswordSharedSecretEncrypted)
        .Set(offer => offer.Granted, true)
        .Update();
      return Ok("OK");
    }


    [HttpGet("test/{CreatorAddressHash}")]
    public IActionResult granTesttOffers(string CreatorAddressHash)
    {
      var results = DataContext.GetTable<FilesAndOffers>()
        .Where(order => order.CreatorAddressHash == CreatorAddressHash && !order.Open && !order.Granted)
        .Take(100)
        .Select(item => new
        {
          item.Title,
          item.DecryptedFileHash,
          item.EncryptedPassword,
          item.BuyerAddressHash
        });
      return Ok(results);
    }
  }
}
