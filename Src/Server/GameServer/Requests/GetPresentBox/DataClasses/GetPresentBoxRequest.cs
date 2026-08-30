using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;

namespace Puniemu.Src.Server.GameServer.Requests.GetPresentBox.DataClasses
{
    public struct GetPresentBoxRequest
    {
        // Client version
        [JsonProperty("appVer")]
        public string AppVer { get; set; }

        // Equivalent to UDKey
        [JsonProperty("deviceId")]
        public string DeviceID { get; set; }

        // Interchangeable with gdkey
        [JsonProperty("level5UserId")]
        public string Level5UserID { get; set; }

        // Version of server data
        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        // OS type. 2 is Android.
        [JsonProperty("osType")]
        public int OsType { get; set; }

        // Always 0 here
        [JsonProperty("userId")]
        public string UserID { get; set; }

        // Always 0
        [JsonProperty("ywpToken")]
        public string YwpToken { get; set; }
    }
}
