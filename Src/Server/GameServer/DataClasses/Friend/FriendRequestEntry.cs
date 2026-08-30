using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class FriendRequestEntry
    {
        [JsonProperty("iconId")]
        public int IconId { get; set; }

        [JsonProperty("playerName")]
        public string? PlayerName { get; set; }

        [JsonProperty("youkaiId")]
        public long YoukaiId { get; set; }

        [JsonProperty("requestDtSentence")]
        public string? RequestDtSentence { get; set; }

        [JsonProperty("titleId")]
        public int TitleId { get; set; }

        [JsonProperty("characterId")]
        public string? CharacterId { get; set; }

        [JsonProperty("requestDt")]
        public string? RequestDt { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }
    }
}
