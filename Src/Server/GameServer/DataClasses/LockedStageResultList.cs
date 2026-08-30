using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class LockedStageResultList
    {
        // stage id
        [JsonProperty("stageId")]
        public long StageId {  get; set; }
        // idk
        [JsonProperty("title")]
        public string? Title { get; set; }
        // idk
        [JsonProperty("conditionType")]
        public int ConditionType { get; set; }
        // idk
        [JsonProperty("description")]
        public string? Description { get; set; }
        // idk
        [JsonProperty("originStageId")]
        public long OriginStageId { get; set; }
    }
}
