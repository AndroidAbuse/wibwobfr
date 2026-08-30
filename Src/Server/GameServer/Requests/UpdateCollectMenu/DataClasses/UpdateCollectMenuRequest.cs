using Newtonsoft.Json;
namespace Puniemu.Src.Server.GameServer.Requests.UpdateCollectMenu.DataClasses
{
    public class UpdateCollectMenuRequest
    {
        //udkey
        [JsonProperty("deviceId")]
        public string? DeviceId { get; set; }
        //gdkey
        [JsonProperty("level5UserId")]
        public string? Level5UserId { get; set; }
        //CollectId
        [JsonProperty("collectId")]
        public int CollectId { get; set; }
        public int TutorialType { get; set; }
    }
}
