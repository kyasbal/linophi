using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace Web.Utility
{
    public class ImageResult : ActionResult
    {
        private readonly Stream _imageStream;
        private readonly string _contentType;

        public ImageResult(Stream imageStream, string contentType)
        {
            _imageStream = imageStream;
            _contentType = contentType;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = _contentType;
            var buffer = new byte[4096];
            while (true)
            {
                int read = _imageStream.Read(buffer, 0, buffer.Length);
                if (read == 0)
                    break;

                response.OutputStream.Write(buffer, 0, read);
            }

            response.End();
        }
    }

    public static class ImageResultExtensions
    {
        public static ImageResult Image(this ApiController controller, Stream imageStream, string contentType)
        {
            return new ImageResult(imageStream, contentType);
        }

        public static ImageResult Image(this ApiController controller, byte[] imageBytes, string contentType)
        {
            return new ImageResult(new MemoryStream(imageBytes), contentType);
        }
    }
}