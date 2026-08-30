using System.Reflection;
using System.Text;

namespace Puniemu.Src.TableParser.DataClasses
{
    // ywp_user_dictionary table definition

    public class YwpUserDictionary
    {
        public long YoukaiId { get; set; }
        public int IsBefriend { get; set; }
        public int IsSeen { get; set; }
    }
}