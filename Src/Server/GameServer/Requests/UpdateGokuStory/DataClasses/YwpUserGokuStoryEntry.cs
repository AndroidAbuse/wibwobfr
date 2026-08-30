using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;
using System.Collections.Generic;

namespace Puniemu.Src.Server.GameServer.Requests.UpdateGokuStory.DataClasses
{
    public class YwpUserGokuStoryEntry
    {
        [JsonProperty("gokuStoryId")]
        public int GokuStoryId { get; set; }
    }
}
