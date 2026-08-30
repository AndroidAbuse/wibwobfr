using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.DataClasses;
using Puniemu.Src.Server.GameServer.Requests.InitGacha.DataClasses;
using System.Buffers;
using System.Text;
using Puniemu.Src.TableParser.DataClasses;
using Puniemu.Src.TableParser.Logic;

namespace Puniemu.Src.Server.GameServer.Logic
{
    public class DictionaryManager
    {
        public static TableParser.Logic.TableParser EditDictionary(TableParser.Logic.TableParser parser, long YoukaiId, bool addSeen, bool addBefriends)
        {
            var YoukaiIndex = parser.FindIndex([YoukaiId.ToString()]);
            var seen = 0;
            var befriend = 0;
            if (addSeen) {
                seen = 1;
            }
            if (addBefriends) {
                befriend = 1;
            }
            if (YoukaiIndex == -1)
            {
                parser.AddRow([YoukaiId.ToString(), befriend.ToString(), seen.ToString()]);
            }
            else
            {
                if (addSeen)
                {
                    parser.Table[YoukaiIndex][2] = "1";
                }
                if (addBefriends)
                {
                    parser.Table[YoukaiIndex][1] = "1";
                }
            }
            return new TableParser.Logic.TableParser(parser.ToString());
        }
        public static void EditDictionary(ref TableParser<YwpUserDictionary> parser, long YoukaiId, bool addSeen, bool addBefriends)
        {
            var YoukaiIndex = GetDictionaryIndex(ref parser, YoukaiId);
            if (YoukaiIndex == -1)
            {
                parser.AddItem(new YwpUserDictionary {YoukaiId = YoukaiId, IsBefriend = addBefriends ? 1 : 0, IsSeen = addSeen ? 1 : 0 });
                return;
            }
            if (addSeen)
            {
                parser.Items[YoukaiIndex].IsSeen = 1;
            }
            if (addBefriends)
            {
                parser.Items[YoukaiIndex].IsBefriend = 1;
            }
        }
        public static int GetDictionaryIndex(ref TableParser<YwpUserDictionary> youkaiList, long YoukaiId)
        {
            uint count = 0;
            foreach (YwpUserDictionary i in youkaiList.Items)
            {
                if (i.YoukaiId == YoukaiId)
                {
                    return (int)count;
                }
                count += 1;
            }
            return -1;
        }
    }
}
