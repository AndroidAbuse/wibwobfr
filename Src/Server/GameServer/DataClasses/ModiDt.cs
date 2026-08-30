using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.BuyHitodama.DataClasses;
using System;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class ModiDt
    {
        [JsonProperty("date")]
        public int Date { get; set; }

        [JsonProperty("day")]
        public int Day { get; set; }

        [JsonProperty("hours")]
        public int Hours { get; set; }

        [JsonProperty("minutes")]
        public int Minutes { get; set; }

        [JsonProperty("month")]
        public int Month { get; set; }

        [JsonProperty("seconds")]
        public int Seconds { get; set; }

        [JsonProperty("time")]
        public long Time { get; set; }

        [JsonProperty("timezoneOffset")]
        public int TimezoneOffset { get; set; }

        [JsonProperty("year")]
        public int Year { get; set; }
        public ModiDt(DateTime now)
        {
            this.Date = now.Day;
            this.Day = (int)now.DayOfWeek;
            this.Hours = now.Hour;
            this.Minutes = now.Minute;
            this.Month = now.Month;
            this.Seconds = now.Second;
            this.Time = new DateTimeOffset(now.ToUniversalTime(), TimeSpan.Zero).ToUnixTimeMilliseconds();
            this.TimezoneOffset = (int)(-TimeZoneInfo.Local.GetUtcOffset(now).TotalMinutes);
            this.Year = now.Year - 1900;
        }
    }
}
