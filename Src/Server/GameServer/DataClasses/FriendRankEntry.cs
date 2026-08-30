using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class FriendRankEntry
    {
        [JsonProperty("iconId")]
        public int IconId { get; set; }

        [JsonProperty("playerName")]
        public string? PlayerName { get; set; }

        [JsonProperty("titleId")]
        public int TitleId { get; set; }

        [JsonProperty("getStar")]
        public int GetStar { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }

        [JsonProperty("dicCnt")]
        public int DicCnt { get; set; }

        [JsonProperty("score")]
        public int Score { get; set; }

        [JsonProperty("youkaiId")]
        public long YoukaiId { get; set; }

        [JsonProperty("getStarModiDt")]
        public ModiDt? GetStarModiDt { get; set; }

        [JsonProperty("hitodamaSendFlg")]
        public int HitodamaSendFlg { get; set; }

        [JsonProperty("onedariSendFlg")]
        public int OnedariSendFlg { get; set; }

        [JsonProperty("rank")]
        public int Rank { get; set; }

        [JsonProperty("self")]
        public int Self { get; set; }
    }
}