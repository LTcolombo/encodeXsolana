using System.Threading.Tasks;
using Utils.Injection;
using Utils.Signal;

namespace Avatar
{
    
    [Singleton]
    public class BalanceModel : InjectableObject<BalanceModel>
    {
        public Signal Updated = new();
        
        [Inject] private BalanceService _service;
        private int _data;

        public async Task Update(string id)
        {
            _data = await _service.GetData(id);
            Updated.Dispatch();
        }

        public int Get()
        {
            return _data;
        }
    }
}