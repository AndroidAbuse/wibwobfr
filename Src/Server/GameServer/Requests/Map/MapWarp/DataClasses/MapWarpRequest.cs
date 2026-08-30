using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.Requests.MapWarp.DataClasses
{
    public struct MapWarpRequest
    {
        // Client version
        [JsonProperty("appVer")]
        public string AppVer { get; set; }

        // Equivalent to UDKey
        [JsonProperty("deviceID")]
        public string DeviceID { get; set; }

        // New name
        [JsonProperty("checkNewFlg")]
        public int CheckNewFlg { get; set; }

        // New name
        [JsonProperty("mapId")]
        public long MapId { get; set; }

        // New name
        [JsonProperty("mapSeq")]
        public long MapSeq { get; set; }

        // Interchangeable with gdkey
        [JsonProperty("level5UserID")]
        public string Level5UserID { get; set; }

        // Version of server data
        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        // OS type. 2 is Android.
        [JsonProperty("osType")]
        public int OsType { get; set; }

        // Always 0 here
        [JsonProperty("userID")]
        public string UserID { get; set; }

        // Always 0
        [JsonProperty("ywpToken")]
        public string YwpToken { get; set; }
    }
}
