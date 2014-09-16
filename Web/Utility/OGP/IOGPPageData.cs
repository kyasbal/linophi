namespace Web.Utility.OGP
{
    public interface IOGPPageData
    {
        string Title { get; }

        string Description { get; }

        string Image { get; }

        string Url{ get; }

        string Locale { get; }
    }
}