using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.Requests.ExecuteGacha.DataClasses
{
    public class ExecuteGachaRequest
    {
        [JsonProperty("activeDeckId")]
        public int ActiveDeckId { get; set; }

        [JsonProperty("appVer")]
        public string? AppVer { get; set; }

        [JsonProperty("deviceId")]
        public string? DeviceId { get; set; }

        [JsonProperty("gachaCnt")]
        public int GachaCnt { get; set; }

        [JsonProperty("gachaId")]
        public int GachaId { get; set; }

        [JsonProperty("level5UserId")]
        public string? Level5UserId { get; set; }

        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        [JsonProperty("osType")]
        public int OsType { get; set; }

        [JsonProperty("requestYoukaiId")]
        public int RequestYoukaiId { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }

        [JsonProperty("ywpToken")]
        public string? YwpToken { get; set; }
    }
}
