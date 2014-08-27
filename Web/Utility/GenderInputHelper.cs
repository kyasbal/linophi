using System.Collections.Generic;
using System.Web.Mvc;

namespace Web.Utility
{
    public class GenderInputHelper
    {
        public static IEnumerable<SelectListItem> getGenderInput()
        {
            yield return new SelectListItem() {Text = "男", Value = "1"};
            yield return new SelectListItem() {Text = "女", Value = "2"};
            yield return new SelectListItem() {Text = "--",Value = "0",Selected = true};
        }
    }
}