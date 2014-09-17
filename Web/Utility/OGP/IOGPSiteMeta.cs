namespace Web.Utility.OGP
{
    public interface IOGPSiteMeta
    {
        /// <summary>
        /// サイト名
        /// </summary>
        string SiteName { get; }
        
        /// <summary>
        /// イメージが指定されてないときに利用するデフォルトのイメージ
        /// </summary>
        string DefaultImage { get; }

        /// <summary>
        /// デフォルトのロケール
        /// </summary>
        string DefaultLocale { get; }
    }
}