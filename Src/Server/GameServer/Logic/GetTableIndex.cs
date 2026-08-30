
namespace Puniemu.Src.Server.GameServer.Logic
{
    public class GetTableIndex
    {
        public static int GetIndex(TableParser.Logic.TableParser parser, List<Tuple<int, string>> data)
        {
            var index = 0;
            var good = true;
            foreach (var item in parser.Table)
            {
                good = true;
                foreach (var must in data)
                {
                    if (!must.Item2.Equals(item[must.Item1]))
                    {
                        good = false;
                    }
                }
                if (good)
                {
                    break;
                }
                index++;
            }
            if (good == false)
            {
                return -1;
            }
            return index;
        }
        public static int[] GetIndexs(TableParser.Logic.TableParser parser, List<Tuple<int, string>> data)
        {
            var good = true;
            int index = 0;
            var indexs = new List<int>();
            foreach (var item in parser.Table)
            {
                good = true;
                foreach (var must in data)
                {
                    if (!must.Item2.Equals(item[must.Item1]))
                    {
                        good = false;
                    }
                }
                if (good)
                {
                    indexs.Add(index);
                }
                index++;
            }
            return indexs.ToArray();
        }
    }
}
