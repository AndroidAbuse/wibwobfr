using System.Reflection;
using System.Text;

namespace Puniemu.Src.TableParser.DataClasses
{
    // ywp_user_youkai table definition
    // value in them end with \, cause some value as 'GeneralStringValue1' store raw sub table

    public class YwpUserEvent
    {
        public long EventId { get; set; }
        public int EventNo { get; set; }
        public int GeneralIntValue1 { get; set; }
        public int GeneralIntValue2 { get; set; }
        public int GeneralIntValue3 { get; set; }
        public int GeneralIntValue4 {  get; set; }
        public int GeneralIntValue5 { get; set; }
        public string? ChanceTimeSec { get; set; }
        public string? ChanceTimeOpenFlg { get; set; }

        public string? GeneralStringValue1 { get; set; } // sub table
        public string? GeneralStringValue2 { get; set; }
        public string? GeneralStringValue3 { get;set; }
        public string? GeneralStringValue4 { get;set; }
        public string? GeneralStringValue5 { get;set; }
        public int FreeBattleCount { get; set; }

    }
}
