using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Utils.Injection;

namespace Avatar
{
    [Singleton]
    public class TurnService : InjectableObject<TurnService>
    {
        private readonly HttpService _http = new();
        public async Task SubmitTurn(string id)
        {
            if (bool.Parse(await _http.Post("http://localhost:8102/api/turn/" + id, "")))
            {
                
            }
        }
    }
}