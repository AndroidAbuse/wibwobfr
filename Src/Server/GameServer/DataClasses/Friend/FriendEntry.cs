using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class FriendEntry
    {
        [JsonProperty("userId")]
        public string? UserId { get; set; }
        [JsonProperty("playerName")]
        public string? PlayerName { get; set; }
        [JsonProperty("iconId")]
        public int IconId { get; set; }
        [JsonProperty("titleId")]
        public int TitleId { get; set; }
        [JsonProperty("youkaiId")]
        public long YoukaiId { get; set; }
        [JsonProperty("lastPlayDtSentence")]
        public string? LastPlayDtSentence { get; set; }
        [JsonProperty("hitodamaSendFlg")]
        public int HitodamaSendFlg { get; set; }
        [JsonProperty("onedariSendFlg")]
        public int OnedariSendFlg { get; set; }
        [JsonProperty("mapLockSendFlg")]
        public int MapLockSendFlg { get; set; }
        [JsonProperty("characterId")]
        public string? CharacterId { get; set; }
        [JsonProperty("lastPlayDt")]
        public string? LastPlayDt { get; set; }
    }
}
