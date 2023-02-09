using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;
using Utils.Injection;

namespace Avatar
{
    [Singleton]
    public class BalanceService : InjectableObject<BalanceService>
    {
        private readonly HttpService _http = new();
        
        public async Task<int> GetData(string id)
        {
             
#if STANDALONE_DEPLOYMENT
            return 0;
#endif
            return int.Parse(await _http.Get("http://localhost:8102/api/balance/" + id));
        }
    }

    public class HttpService
    {
        public async Task<string> Get(string url)
        {
            var request = UnityWebRequest.Get(url);
            await Task.Yield();
            request.SendWebRequest();
            while (!request.isDone)
                await Task.Yield();
            
            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(request.error);
                return null;
            }
            
            return request.downloadHandler.text;
        }

        public async Task<string> Post(string url, string content)
        {
            var request = UnityWebRequest.Put(url, content);
            request.SetRequestHeader("Content-Type", "application/json");
            request.method = "POST";
            await Task.Yield();
            request.SendWebRequest();
            while (!request.isDone)
                await Task.Yield();
            
            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(request.error);
                return null;
            }
            
            return request.downloadHandler.text;
        }
    }
}