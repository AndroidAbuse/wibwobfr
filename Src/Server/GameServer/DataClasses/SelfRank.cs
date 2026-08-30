using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.BuyHitodama.DataClasses;
using System;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class SelfRank
    {
        [JsonProperty("rankStart")]
        public int RankStart { get; set; }

        [JsonProperty("score")]
        public long Score { get; set; }

        [JsonProperty("leagueId")]
        public int LeagueId { get; set; }

        [JsonProperty("rank")]
        public int Rank { get; set; }

        [JsonProperty("groupNo")]
        public int GroupNo { get; set; }

        [JsonProperty("remainSec")]
        public long RemainSec { get; set; }

        [JsonProperty("leagueChangeStatus")]
        public int LeagueChangeStatus { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }

        public SelfRank(YwpUserData userdata)
        {
            this.RankStart = 1;
            this.Score = 0;
            this.LeagueId = 5;
            this.Rank = 0;
            this.RemainSec = 0;
            this.UserId = userdata.UserID;
            this.LeagueChangeStatus = 0;
        }
    }
}
