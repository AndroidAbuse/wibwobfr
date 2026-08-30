using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;

namespace Puniemu.Src.Server.GameServer.Requests.FriendSearch.DataClasses
{
    public class FriendsEntry
    {
        [JsonProperty("iconId")]
        public int IconId { get; set; }

        [JsonProperty("playerName")]
        public string? PlayerName { get; set; }

        [JsonProperty("youkaiId")]
        public long YoukaiId { get; set; }

        [JsonProperty("lastPlayDtSentence")]
        public string? LastPlayDtSentence { get; set; }

        [JsonProperty("titleId")]
        public int TitleId { get; set; }

        [JsonProperty("characterId")]
        public string? CharacterId { get; set; }

        [JsonProperty("lastPlayDt")]
        public string? LastPlayDt { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }
    }
}
