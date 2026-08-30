using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.UpdateGokuMenu.DataClasses;
using System.Buffers;

namespace Puniemu.Src.Server.GameServer.Requests.UpdateGokuMenu.Logic
{
    public class UpdateGokuMenuHandler
    {
        public static async Task HandleAsync(HttpContext ctx)
        {
            ctx.Request.EnableBuffering();
            var readResult = await ctx.Request.BodyReader.ReadAsync();
            var encRequest = Encoding.UTF8.GetString(readResult.Buffer.ToArray());
            ctx.Request.BodyReader.AdvanceTo(readResult.Buffer.End);

            var requestJsonString = NHNCrypt.Logic.NHNCrypt.DecryptRequest(encRequest)!;
            var deserialized = JsonConvert.DeserializeObject<UpdateGokuMenuRequest>(requestJsonString)!;

            var res = await UpdateGokuMenuResponse.BuildAsync(deserialized);

            var outDict = await res.ToDictionary(deserialized?.Level5UserId ?? deserialized?.DeviceId ?? "");
            var outJson = JsonConvert.SerializeObject(outDict);
            var outResponse = NHNCrypt.Logic.NHNCrypt.EncryptResponse(outJson);

            await ctx.Response.WriteAsync(outResponse);
        }
    }
}
