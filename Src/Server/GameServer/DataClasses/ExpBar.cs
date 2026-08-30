using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class ExpBar
    {
        // percentage of denominator and numerator
        [JsonProperty("pctg")]
        public int Percentage = 0;
        // denominator | number of exp max for this level
        [JsonProperty("denominator")]
        public int Denominator = 0;
        // numerator | number of exp actually gained for this level
        [JsonProperty("numerator")]
        public int Numerator = 0;
    }
}
