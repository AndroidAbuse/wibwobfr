using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;

namespace Puniemu.Src.Server.GameServer.Requests.StartScoreAttack.DataClasses
{
    public class StartScoreAttackRequest
    {
        [JsonProperty("appVer")]
        public string ?AppVer { get; set; }

        [JsonProperty("deviceId")]
        public string ?DeviceId { get; set; }

        [JsonProperty("level5UserId")]
        public string ?Level5UserId { get; set; }

        [JsonProperty("userId")]
        public string ?UserId { get; set; }

        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        [JsonProperty("osType")]
        public int OsType { get; set; }

        [JsonProperty("token")]
        public string ?Token { get; set; }

        [JsonProperty("ywpToken")]
        public string ?YwpToken { get; set; }

        [JsonProperty("activeDeckId")]
        public int? ActiveDeckId { get; set; }

        [JsonProperty("scoreAttackId")]
        public int? ScoreAttackId { get; set; }

        [JsonProperty("freePlayFlg")]
        public int? FreePlayFlg { get; set; }

        [JsonProperty("useItemList")]
        public List<object> UseItemList { get; set; } = new();
    }
}