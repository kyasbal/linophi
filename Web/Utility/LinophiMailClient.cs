using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Web.Utility.Configuration;

namespace Web.Utility
{
    public class LinophiMailClient
    {
        private static LinophiMailClient instance;

        public static LinophiMailClient Instance
        {
            get
            {
                LinophiMailClient.instance = LinophiMailClient.instance ?? new LinophiMailClient();
                return LinophiMailClient.instance;
            }
        }

        public LinophiMailClient()
        {
            IConfigurationLoader configurationLoader = ConfigurationLoaderFactory.GetConfigurationLoader();
            this.Credential=new NetworkCredential(configurationLoader.GetConfiguration("SendGrid-MailUser"),configurationLoader.GetConfiguration("SendGrid-MailPass"));
        }

        public NetworkCredential Credential { get; set; }

        public SmtpClient SmtpClient
        {
            get
            {
                var client = new SmtpClient("smtp.sendgrid.net", Convert.ToInt32(587));
                client.Credentials = Credential;
                return client;
            }
        }

        public void SendMessage(MailMessage message)
        {
            SmtpClient.Send(message);
        }
    }
}