using System.Reflection;
using System.Text;

namespace Puniemu.Src.TableParser.DataClasses
{
    // ywp_user_youkai table definition

    public class YwpUserYoukaiSkill
    {
        public long YoukaiId { get; set; }
        public int Level { get; set; }
        public int Points { get; set; }
        public int PercentageDenominator { get; set; }
        public int PercentageNumerator { get; set; }
        public int Percentage {  get; set; }
    }
}