using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class ExpInfo
    {
        //Yokai level
        [JsonProperty("level")]
        public int Level = 0;
        //Yokai exp
        [JsonProperty("exp")]
        public int Exp = 0;
        //Exp Bar
        [JsonProperty("expBar")]
        public ExpBar ExpBar = new();
    }
}
