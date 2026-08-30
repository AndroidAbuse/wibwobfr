using System.Reflection;
using System.Text;

namespace Puniemu.Src.TableParser.DataClasses
{
    // ywp_user_youkai table definition

    public class YwpUserYoukai
    {
        public long YoukaiId { get; set; }
        public int Level { get; set; }
        public long Exp { get; set; }
        public int Hp { get; set; }
        public int Atk { get; set; }
        public int ExpDenominator { get; set; }
        public int ExpNumerator { get; set; }
        public int Percentage { get; set; }
        public int IsLockedLevel { get; set; }
        public long BefriendDate { get; set; }
        public int BreakLimitCount { get; set; }
    }
}
//580|200|34|0|1771182280463|0