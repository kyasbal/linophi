namespace Web.Api.Response.Article
{
    public class ExistenceResponse
    {
        public ExistenceResponse(bool isExist)
        {
            IsExist = isExist;
        }

        public bool IsExist { get; set; }
    }
}