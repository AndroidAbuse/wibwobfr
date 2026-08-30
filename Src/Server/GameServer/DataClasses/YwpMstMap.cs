using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.DataClasses
{
    public class YwpMstMap
    {
        [JsonProperty("mapId")]
        public long MapId = 0;

        [JsonProperty("needFriendPoint")]
        public long NeedFriendPoint = 0;

        [JsonProperty("needYoukaiId")]
        public long NeedYoukaiId = 0;

        [JsonProperty("needYoukaiLevel")]
        public int NeedYoukaiLevel = 0;

        [JsonProperty("needYmoney")]
        public long NeedYmoney = 0;

        [JsonProperty("textUnlock")]
        public string TextUnlock = "";

        [JsonProperty("reverseMapViewInfo")]
        public string ReverseMapViewInfo = "";

        [JsonProperty("description")]
        public string Description = "";

        [JsonProperty("closeDt")]
        public string CloseDt = "";

        [JsonProperty("mapSubType")]
        public int MapSubType = 0;

        [JsonProperty("routeName")]
        public string RouteName = "";

        [JsonProperty("miniBackGroundName")]
        public string MiniBackGroundName = "";

        [JsonProperty("dayOfWeek")]
        public string DayOfWeek = "";

        [JsonProperty("mapName")]
        public string MapName = "";

        [JsonProperty("backGroundName")]
        public string BackGroundName = "";

        [JsonProperty("cameraName")]
        public string CameraName = "";

        [JsonProperty("eventId")]
        public long EventId = 0;

        [JsonProperty("generalStringParam")]
        public string GeneralStringParam = "";

        [JsonProperty("nextMapId")]
        public long NextMapId = 0;

        [JsonProperty("mapType")]
        public int MapType = 0;

        [JsonProperty("extraMapId")]
        public long ExtraMapId = 0;

        [JsonProperty("sort")]
        public int Sort = 0;

        [JsonProperty("tagName")]
        public string TagName = "";

        [JsonProperty("difficulty")]
        public int Difficulty = 0;

        [JsonProperty("reverseMapId")]
        public long ReverseMapId = 0;

        [JsonProperty("bgmName")]
        public string BgmName = "";

        [JsonProperty("openDt")]
        public string OpenDt = "";

        [JsonProperty("attributeBitNum")]
        public int AttributeBitNum = 0;

        [JsonProperty("screenEffectType")]
        public int ScreenEffectType = 0;
    }
}