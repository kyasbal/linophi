using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Web.Utility.Configuration;

namespace Web.Storage.Connection
{
    public class StorageConnectionBase
    {
        public StorageConnectionBase()
        {
            StorageAccount =
                new CloudStorageAccount(new StorageCredentials("linophi", "v2SuurJ84CZmi95smIAktNaHUSGvhAuBq8T78Rr46fR9xZC7xLFWDT3/HWoYTBby8qzVbAd1Ez8p1K7mcPNfvA=="),
                    useHttps: false); 
            SetDevelopmentStorageAccount();
        }
        public CloudStorageAccount StorageAccount { get; private set; }

        private void SetDevelopmentStorageAccount()
        {
            if(ConfigurationLoaderFactory.GetConfigurationLoader().IsLocalConfiguration())
                StorageAccount = new CloudStorageAccount(new StorageCredentials("linophidebug", "7toc3SgBFfxIec093964NqLA1kveLebYHsQZ6S5kwFxGADEmOnX7zuznxDfFdt0Sy7DukzQ8NKj/GPuKk6mLQQ=="), false);
        }
    }
}