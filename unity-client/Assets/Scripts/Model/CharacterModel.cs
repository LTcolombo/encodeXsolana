using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Utils.Injection;
using Utils.Signal;

namespace CityBuilding
{
    
    
    [Singleton]
    public class CharacterModel : InjectableObject<CharacterModel>
    {
        [Inject] private ConfigService _config;
        [Inject] private CharacterService _service;
        
        public readonly Signal Updated = new();

        public string[] Characters { get; private set; }

        public void Set(string[] value)
        {
        }

        public async Task Load(string accountId)
        {
            Characters = await _service.GetCharacterData(accountId); 
            Updated.Dispatch();
        }
    }
}