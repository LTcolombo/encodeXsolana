using System.Net.Http;
using System.Threading.Tasks;
using Avatar;
using Newtonsoft.Json;
using Utils.Injection;

namespace CityBuilding
{
    public class CharacterData
    {
        public string prefab;
    }

    public enum BuildingState
    {
        Poor = 0,
        Fair,
        Good,
        Perfect
    }

    public enum BuildingType
    {
        Generator,
        Distributor,
        Shop,
        Factory,
        Hotel
    }

    public class BuildConfig
    {
        public int width;
        public int height;
        public Building[] buildings;
    }

    public class Building
    {
        public int width;
        public int height;
        public string prefab;
        public BuildingType type;
    }


    [Singleton]
    public class ConfigService : InjectableObject<ConfigService>
    {
        private readonly HttpService _http = new();

        public async Task<BuildConfig> Get()
        {
#if STANDALONE_DEPLOYMENT
            return new BuildConfig();
#else
            return JsonConvert.DeserializeObject<BuildConfig>(await _http.Get("http://localhost:8102/api/config"));
#endif
        }
    }
}