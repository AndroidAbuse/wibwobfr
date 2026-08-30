using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class YokaiCollectEntry
    {
        [JsonProperty("collectId")]
        public int CollectId { get; set; }

        [JsonProperty("collectCnt")]
        public int CollectCnt { get; set; }

        [JsonProperty("menuIdList")]
        public string? MenuIdList { get; set; }
    }
}