using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Avatar;
using Newtonsoft.Json;
using UnityEngine;
using Utils.Injection;

namespace CityBuilding
{
    public class BuildingData
    {
        public int x;
        public int y;
        public int level;
        public BuildingState state;
        public BuildingType type;
    }

    [Singleton]
    public class BuilderService : InjectableObject<BuilderService>
    {
        private readonly HttpService _http = new();
        public async Task<BuildingData[] > GetBuildingsData(string id)
        {
            return JsonConvert.DeserializeObject<BuildingData[] >(
                await _http.Get($"http://localhost:8102/api/building/{id}"));
        }
        
        public async Task<byte[,]> GetCellsData(string id)
        {
            return JsonConvert.DeserializeObject<byte[,]>(await _http.Get(
                $"http://localhost:8102/api/cells/{id}"));
        }

        public async Task<bool> PlaceBuilding(string id, int cellX, int cellY, BuildingType type)
        {
            return bool.Parse(await _http.Post(
                $"http://localhost:8102/api/building/{id}", JsonConvert.SerializeObject(
                    new { x = cellX, y = cellY, type })));
        }
    }
}