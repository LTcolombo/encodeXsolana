using System.Threading.Tasks;
using Utils.Injection;
using Utils.Signal;

namespace Avatar
{
    
    [Singleton]
    public class AccountModel:InjectableObject<AccountModel>
    {
        public string Id;
    }
}