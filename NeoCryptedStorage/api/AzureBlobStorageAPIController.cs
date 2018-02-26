using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using NeoCryptedStorage.SettingModels;

namespace NeoCryptedStorage.Api
{
  [Produces("application/json")]
  [Route("api/AzureBlobStorageAPI")]
  public class AzureBlobStorageAPIController : Controller
  {
    private readonly IOptions<AzureBlobStorageSetting> _storageOptions;

    public AzureBlobStorageAPIController(IOptions<AzureBlobStorageSetting> storageOptions)
    {
      _storageOptions = storageOptions;
    }

    private async Task<CloudBlobContainer> GetCloudBlobContainer()
    {
      CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_storageOptions.Value.ConnectionString);
      CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
      CloudBlobContainer container = blobClient.GetContainerReference("test-blob-container");

      await container.CreateIfNotExistsAsync();

      return container;
    }
    // https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api#getting-to-do-items
    [HttpGet()]
    public async Task<IActionResult> GetAllBlobs()
    {
      CloudBlobContainer container = await GetCloudBlobContainer();
      var blobs = new List<Uri>();
          
      
      BlobContinuationToken continuationToken = null;
      BlobResultSegment resultSegment = null;

      //Call ListBlobsSegmentedAsync and enumerate the result segment returned, while the continuation token is non-null.
      //When the continuation token is null, the last page has been returned and execution can exit the loop.
      do
      {
        //This overload allows control of the page size. You can return all remaining results by passing null for the maxResults parameter,
        //or by calling a different overload.
        resultSegment = await container.ListBlobsSegmentedAsync("", true, BlobListingDetails.All, 10, continuationToken, null, null);
        foreach (var blobItem in resultSegment.Results)
        {
          blobs.Add(blobItem.StorageUri.PrimaryUri);
        }

        //Get the continuation token.
        continuationToken = resultSegment.ContinuationToken;
      }
      while (continuationToken != null);

      return Ok(blobs);
    }


    // https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api#getting-to-do-items
    [HttpPut()]
    public async Task<IActionResult> AddBlob(List<IFormFile> files)
    {
      CloudBlobContainer container = await GetCloudBlobContainer();
      long size = files.Sum(f => f.Length);     

      foreach (var formFile in files)
      {
        CloudBlockBlob blob = container.GetBlockBlobReference(formFile.FileName);
        blob.Properties.ContentType = formFile.ContentType;
        await blob.UploadFromStreamAsync(formFile.OpenReadStream());
      }

      return Ok(new { count = files.Count, size });
    }
  }
}
