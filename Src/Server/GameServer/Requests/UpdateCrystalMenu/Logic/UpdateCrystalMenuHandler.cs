using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.UpdateCrystalMenu.DataClasses;
using System.Text;
using System.Buffers;

namespace Puniemu.Src.Server.GameServer.Requests.UpdateCrystalMenu.Logic
{
    public class UpdateCrystalMenuHandler
    {
        public static async Task HandleAsync(HttpContext ctx)
        {
            ctx.Request.EnableBuffering();
            var readResult = await ctx.Request.BodyReader.ReadAsync();
            var encRequest = Encoding.UTF8.GetString(readResult.Buffer.ToArray());
            ctx.Request.BodyReader.AdvanceTo(readResult.Buffer.End);

            var requestJsonString = NHNCrypt.Logic.NHNCrypt.DecryptRequest(encRequest)!;
            var deserialized = JsonConvert.DeserializeObject<UpdateCrystalMenuRequest>(requestJsonString)!;

            var res = await UpdateCrystalMenuResponse.BuildAsync(deserialized);

            var outDict = await res.ToDictionary(deserialized?.Level5UserId ?? "");
            var outJson = JsonConvert.SerializeObject(outDict);

            var outResponse = NHNCrypt.Logic.NHNCrypt.EncryptResponse(outJson);
            await ctx.Response.WriteAsync(outResponse);
        }
    }
}
