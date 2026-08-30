using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class YokaiIntroEntry
    {
        [JsonProperty("userId")]
        public string? UserId { get; set; }

        [JsonProperty("introId")]
        public int IntroId { get; set; }

        [JsonProperty("progress")]
        public string? Progress { get; set; }
    }
}