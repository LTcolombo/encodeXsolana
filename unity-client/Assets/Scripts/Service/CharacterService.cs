using System;
using System.Net.Http;
using System.Threading.Tasks;
using Avatar;
using Newtonsoft.Json;
using Utils.Injection;

namespace CityBuilding
{
    [Singleton]
    public class CharacterService : InjectableObject<CharacterService>
    {
        private readonly HttpService _http = new();

        public async Task<string[]> GetCharacterData(string id)
        {
            return JsonConvert.DeserializeObject<string[]>(
                await _http.Get($"http://localhost:8102/api/characters/{id}"));
        }
    }
}