using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Api.Response.Article
{
    public class VerifyTitleResponse
    {
        public static VerifyTitleResponse GenerateSuccessResponse()
        {
            return new VerifyTitleResponse(){IsOK = true,ErrorMessage = "S_OK"};
        }

        public static VerifyTitleResponse GenerateFailedResponse(string errorMsg)
        {
            return new VerifyTitleResponse() {IsOK = false, ErrorMessage = errorMsg};
        }

        public bool IsOK { get; set; }

        public string ErrorMessage { get; set; }
    }
}