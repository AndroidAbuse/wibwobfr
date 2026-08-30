using Newtonsoft.Json;
using Puniemu.Src.Server.GameServer.Requests.GetPresentBox.DataClasses;
using Puniemu.Src.Server.GameServer.DataClasses;
using System.Text;

using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.Json.Nodes;
using System.Buffers;
using Puniemu.Src.Utils.GeneralUtils;

namespace Puniemu.Src.Server.GameServer.Requests.GetPresentBox.Logic
{
    public class GetPresentBoxHandler
    {
        public static async Task HandleAsync(HttpContext ctx)
        {
            ctx.Request.EnableBuffering();
            var readResult = await ctx.Request.BodyReader.ReadAsync();
            var encRequest = Encoding.UTF8.GetString(readResult.Buffer.ToArray());
            ctx.Request.BodyReader.AdvanceTo(readResult.Buffer.End);
            var requestJsonString = NHNCrypt.Logic.NHNCrypt.DecryptRequest(encRequest);
            var deserialized = JsonConvert.DeserializeObject<GetPresentBoxRequest>(requestJsonString!);
            ctx.Response.ContentType = "application/json";
            GetPresentBoxResponse res = new();
            List<string> tables = new List<string>
            {
                "ywp_user_data",
                "ywp_user_present_box_list",
                "ywp_user_icon_budge"
            };
            var resdict = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(res));
            await GeneralUtils.AddTablesToResponse(tables, resdict!, false, deserialized!.Level5UserID!);
            var marshalledResponse = JsonConvert.SerializeObject(resdict);
            var encryptedResponse = NHNCrypt.Logic.NHNCrypt.EncryptResponse(marshalledResponse);
            await ctx.Response.WriteAsync(encryptedResponse);
        }
    }
}
