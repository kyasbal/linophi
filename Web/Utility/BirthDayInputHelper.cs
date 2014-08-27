using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Web.Utility
{
    public class BirthDayInputHelper
    {
        public static IEnumerable<SelectListItem> getMonthList()
        {
            for (int i = 1; i <= 12; i++)
            {
                yield return new SelectListItem(){Text = i.ToString(),Value = i.ToString()};
            }
            yield return new SelectListItem(){Text = "--",Value = "0",Selected = true};
        }

        public static IEnumerable<SelectListItem> getYearList()
        {
            for (int i = 1900; i <= DateTime.Now.Year; i++)
            {
                yield return new SelectListItem(){Text = i.ToString(),Value = i.ToString()};
            }
            yield return new SelectListItem(){Text = "----",Value = "0",Selected = true};
        }

        public static IEnumerable<SelectListItem> getDayList()
        {
            for (int i = 1; i <= 31; i++)
            {
                yield return new SelectListItem(){Text = i.ToString(),Value = i.ToString()};
            }
            yield return new SelectListItem(){Text = "--",Value = "0",Selected = true};
        }
    }
}