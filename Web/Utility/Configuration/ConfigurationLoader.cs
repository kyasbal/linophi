// ***********************************************************************
// Assembly         : LinophiWeb
// Author           : Lime
// Created          : 08-12-2014
//
// Last Modified By : Lime
// Last Modified On : 07-23-2014
// ***********************************************************************
// <copyright file="ConfigurationLoader.cs" company="beep">
//     Copyright (c) . All rights reserved.
// </copyright>
// <summary>設定情報を読み込むクラス</summary>
// ***********************************************************************

using Microsoft.WindowsAzure.ServiceRuntime;

namespace Web.Utility.Configuration
{
    /// <summary>
    /// Interface IConfigurationLoader
    /// </summary>
    public interface IConfigurationLoader
    {
        /// <summary>
        /// Gets the configuration.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <returns>System.String.</returns>
        string GetConfiguration(string key);
    }

    /// <summary>
    /// IConfigurationLoaderのインスタンスを生成できる唯一のファクトリクラス
    /// </summary>
    public static class ConfigurationLoaderFactory
    {
        /// <summary>
        /// 読み込みを実行するインターフェース
        /// </summary>
        private static IConfigurationLoader _loader;

        /// <summary>
        /// 現在のプロジェクト用のIConfigurationLoaderを取得する
        /// </summary>
        /// <returns>取得されたIConfigurationLoader</returns>
        public static IConfigurationLoader GetConfigurationLoader()
        {
            return _loader ?? (_loader = new CloudConfigurationLoader());
        }

        /// <summary>
        /// クラウドの情報から読み込むクラス
        /// </summary>
        private class CloudConfigurationLoader : IConfigurationLoader
        {
            /// <summary>
            /// Gets the configuration.
            /// </summary>
            /// <param name="key">The key.</param>
            /// <returns>System.String.</returns>
            public string GetConfiguration(string key)
            {
                var configurationSettingValue = RoleEnvironment.GetConfigurationSettingValue(key);
                return configurationSettingValue;
            }
        }
    }
}
