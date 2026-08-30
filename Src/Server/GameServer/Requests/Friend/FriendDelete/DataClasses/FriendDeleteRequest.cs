using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.Requests.FriendDelete.DataClasses
{
    public class FriendDeleteRequest
    {
        [JsonProperty("appVer")]
        public string? AppVer { get; set; }

        [JsonProperty("deviceID")]
        public string? DeviceID { get; set; }

        [JsonProperty("targetUserId")]
        public string? TargetUserId { get; set; }

        [JsonProperty("level5UserID")]
        public string? Level5UserID { get; set; }

        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        [JsonProperty("osType")]
        public int OsType { get; set; }

        [JsonProperty("userID")]
        public string? UserID { get; set; }

        [JsonProperty("ywpToken")]
        public string? YwpToken { get; set; }
    }
}
