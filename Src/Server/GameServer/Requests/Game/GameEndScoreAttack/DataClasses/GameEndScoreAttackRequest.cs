using Newtonsoft.Json;

namespace Puniemu.Src.Server.GameServer.Requests.GameEndScoreAttack.DataClasses
{
    public class GameEndScoreAttackRequest
    {
        [JsonProperty("activeDeckId")]
        public int ActiveDeckId { get; set; }

        [JsonProperty("appVer")]
        public string? AppVer { get; set; }

        [JsonProperty("bonusBlockNum")]
        public int BonusBlockNum { get; set; }

        [JsonProperty("comboMax")]
        public int ComboMax { get; set; }

        [JsonProperty("damageTotal")]
        public int DamageTotal { get; set; }

        [JsonProperty("deviceId")]
        public string? DeviceId { get; set; }

        [JsonProperty("endOrderNo")]
        public int EndOrderNo { get; set; }

        [JsonProperty("enemyYoukaiResultList")]
        public List<EnemyYoukaiScoreAttackResult> EnemyYoukaiResultList { get; set; } = new();

        [JsonProperty("eraseNumTotal")]
        public int EraseNumTotal { get; set; }

        [JsonProperty("eraseSizeAve")]
        public string? EraseSizeAve { get; set; }

        [JsonProperty("eraseSizeMax")]
        public int EraseSizeMax { get; set; }

        [JsonProperty("feverTimeNum")]
        public int FeverTimeNum { get; set; }

        [JsonProperty("level5UserId")]
        public string? Level5UserId { get; set; }

        [JsonProperty("linkSizeMax")]
        public int LinkSizeMax { get; set; }

        [JsonProperty("mstVersionVer")]
        public int MstVersionVer { get; set; }

        [JsonProperty("osType")]
        public int OsType { get; set; }

        [JsonProperty("pauseAtkNum")]
        public int PauseAtkNum { get; set; }

        [JsonProperty("recvDamageTotal")]
        public int RecvDamageTotal { get; set; }

        [JsonProperty("remainHp")]
        public int RemainHp { get; set; }

        [JsonProperty("requestId")]
        public string? RequestId { get; set; }

        [JsonProperty("score")]
        public long Score { get; set; }

        [JsonProperty("scoreLog")]
        public string? ScoreLog { get; set; }

        [JsonProperty("skillNumTotal")]
        public int SkillNumTotal { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }

        [JsonProperty("userYoukaiResultList")]
        public List<UserYoukaiScoreAttackResult> UserYoukaiResultList { get; set; } = new();

        [JsonProperty("ywpToken")]
        public string? YwpToken { get; set; }

        [JsonProperty("ywp_mst_game_const")]
        public List<Dictionary<string, object>> YwpMstGameConst { get; set; } = new();
    }

    public class EnemyYoukaiScoreAttackResult
    {
        [JsonProperty("defeatFlg")]
        public int DefeatFlg { get; set; }

        [JsonProperty("enemyId")]
        public long EnemyId { get; set; }
    }

    public class UserYoukaiScoreAttackResult
    {
        [JsonProperty("damageMax")]
        public int DamageMax { get; set; }

        [JsonProperty("damageTotal")]
        public int DamageTotal { get; set; }

        [JsonProperty("recoveryActual")]
        public int RecoveryActual { get; set; }

        [JsonProperty("recoveryMax")]
        public int RecoveryMax { get; set; }

        [JsonProperty("sSkillUseNum")]
        public int SSkillUseNum { get; set; }

        [JsonProperty("skillUseNum")]
        public int SkillUseNum { get; set; }

        [JsonProperty("youkaiId")]
        public long YoukaiId { get; set; }
    }
}