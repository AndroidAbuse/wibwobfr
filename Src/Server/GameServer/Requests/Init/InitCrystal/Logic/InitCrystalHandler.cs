using System.Text;
using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.InitCrystal.DataClasses;
using System.Buffers;

namespace Puniemu.Src.Server.GameServer.Requests.InitCrystal.Logic
{
    public class InitCrystalHandler
    {
        public static async Task HandleAsync(HttpContext ctx)
        {
            ctx.Request.EnableBuffering();
            var readResult = await ctx.Request.BodyReader.ReadAsync();
            var encRequest = Encoding.UTF8.GetString(readResult.Buffer.ToArray());
            ctx.Request.BodyReader.AdvanceTo(readResult.Buffer.End);

            var requestJsonString = NHNCrypt.Logic.NHNCrypt.DecryptRequest(encRequest);
            var deserialized = JsonConvert.DeserializeObject<InitCrystalRequest>(requestJsonString!)!;

            var res = await InitCrystalResponse.BuildAsync(deserialized);

            var outDict = await res.ToDictionary(deserialized?.DeviceId ?? "");
            var outResponse = NHNCrypt.Logic.NHNCrypt.EncryptResponse(JsonConvert.SerializeObject(outDict));
            await ctx.Response.WriteAsync(outResponse);
        }
    }
}
