using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Api.Response
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