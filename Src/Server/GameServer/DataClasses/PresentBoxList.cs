using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.BuyHitodama.DataClasses;
using System;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class PresentBoxList
    {
        // Limit bonus limit text
        [JsonProperty("bonusLimitMsg")]
        public string? BonusLimitMsg { get; set; }

        // Idk
        [JsonProperty("distItemResource")]
        public string? DistItemResource { get; set; }

        // Idk
        [JsonProperty("msgType")]
        public int MsgType { get; set; }

        // icon id
        [JsonProperty("targetIconId")]
        public int TargetIconId { get; set; }

        // "Does this present will be recieved when user click on recieve all button ?" flag
        [JsonProperty("canReceiveAll")]
        public int CanReceiveAll { get; set; }

        // Date where present will be automically deleted
        [JsonProperty("limitDtStr")]
        public string? LimitDtStr { get; set; }

        // number of item gived
        [JsonProperty("distItemCnt")]
        public int DistItemCnt { get; set; }

        // title id
        [JsonProperty("targetTitleId")]
        public int TargetTitleId { get; set; }

        // target user id
        [JsonProperty("targetUserId")]
        public string? TargetUserId { get; set; }

        // Item id
        [JsonProperty("distItemId")]
        public long DistItemId { get; set; }

        // Your user id
        [JsonProperty("userId")]
        public string? UserId { get; set; }

        // item type
        [JsonProperty("distItemType")]
        public int DistItemType { get; set; }

        // present main name
        [JsonProperty("bodyText")]
        public string? BodyText { get; set; }

        // Gived ymoney if limited bonus
        [JsonProperty("bonusYmoney")]
        public int BonusYmoney { get; set; }

        // target playerName
        [JsonProperty("targetPlayerName")]
        public string? TargetPlayerName { get; set; }

        // present icon type
        [JsonProperty("iconType")]
        public int IconType { get; set; }

        // idk
        [JsonProperty("layerName")]
        public string? LayerName { get; set; }

        // idk
        [JsonProperty("distItemName")]
        public string? DistItemName { get; set; }

        // present Id
        [JsonProperty("seq")]
        public long Seq { get; set; }

        // Present creation date
        [JsonProperty("regDtStr")]
        public string? RegDtStr { get; set; }
    }
}
