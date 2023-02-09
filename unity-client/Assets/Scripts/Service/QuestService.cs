using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Utils.Injection;

namespace Avatar
{
    [Singleton]
    public class QuestService:InjectableObject<QuestService>
    {
        private readonly HttpService _http = new();
        public async Task<List<QuestInstance>> GetData(string id)
        {
            return JsonConvert.DeserializeObject<List<QuestInstance>>(
                await _http.Get("http://localhost:8102/api/quests/" + id));
        }

        public async Task<bool> CompleteQuest(string id, string questId, int outcomeId)
        {
            return bool.Parse(await _http.Post("http://localhost:8102/api/quests/" + id,
                JsonConvert.SerializeObject(new { questId, outcomeId })));
        }
    }
}