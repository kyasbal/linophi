using System;

namespace Web.Utility
{
    public static class MathEx
    {
        /// <summary>
        /// 渡した数値をMin～Max以内に収めます
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int Clamp(int min, int max, int value)
        {
            return Math.Max(min, Math.Min(max, value));
        }

        /// <summary>
        /// 妥当な日付かどうか検証します
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="day"></param>
        /// <returns></returns>
        public static bool IsValidDate(int year, int month, int day)
        {
            if ((DateTime.MinValue.Year > year) || (year > DateTime.MaxValue.Year))
            {
                return false;
            }

            if ((DateTime.MinValue.Month > month) || (month > DateTime.MaxValue.Month))
            {
                return false;
            }

            int iLastDay = DateTime.DaysInMonth(year, month);

            if ((DateTime.MinValue.Day > day) || (day > iLastDay))
            {
                return false;
            }

            return true;
        }

    }
}