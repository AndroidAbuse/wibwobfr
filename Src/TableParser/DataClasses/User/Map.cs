using System.Reflection;
using System.Text;

namespace Puniemu.Src.TableParser.DataClasses
{
    public class YwpUserMap
    {
        public long MapId { get; set; }
        public int IsUnlocked { get; set; } // idk not sure
        public int FriendCount { get; set; } // current friend count (used for needfrientcount for map unlocking) | idk not sure
    }
}