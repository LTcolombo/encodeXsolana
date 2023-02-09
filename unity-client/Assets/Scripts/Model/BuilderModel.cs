using System;
using System.Linq;
using System.Threading.Tasks;
using DefaultNamespace;
using DefaultNamespace.Model;
using Utils.Injection;
using Utils.Signal;

namespace CityBuilding
{
    [Singleton]
    public class BuilderModel : InjectableObject<BuilderModel>
    {
        [Inject] private BuilderService _service;
        [Inject] private InteractionModel _interaction;
        [Inject] private ConfigService _config;

        public readonly Signal Updated = new();

        public byte[,] OccupiedData { get; private set; }
        public Building Current { get; private set; }

        public BuildingData[] Buildings { get; private set; }

        public BuildConfig Config { get; private set; }

        public async Task Load(string id)
        {
#if STANDALONE_DEPLOYMENT
            OccupiedData = new byte[20, 18];
            Buildings = Array.Empty<BuildingPlacement>();
            Config = new BuildConfig()
            {
                width = 20,
                height = 18,
                buildings = new Building[]
                {
                    new()
                    {
                        type = BuildingType.Generator,
                        width = 4,
                        height = 4,

                        prefab = "Buildings/Generator"
                    },

                    new()
                    {
                        type = BuildingType.Distributor,
                        width = 2,
                        height = 2,
                        prefab = "Buildings/Distributor"
                    }
                }
            };
#else

            Config = await _config.Get();
            Buildings = await _service.GetBuildingsData(id);
            
            OccupiedData = await _service.GetCellsData(id);
            Updated.Dispatch();
#endif
        }
        
        

        public void StartPlacement(BuildingType building)
        {
            Current = Config.buildings.First(b => b.type == building);
            _interaction.Set(InteractionState.Building);
        }


        public async Task PutBuilding(string id, int x, int y)
        {
            await _service.PlaceBuilding(id, x, y, Current.type);
        }

        public Building GetConfig(BuildingType type)
        {
            return Config.buildings.First(b => b.type == type);
        }
    }
}