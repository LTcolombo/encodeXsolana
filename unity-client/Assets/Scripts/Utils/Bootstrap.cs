using System.Runtime.InteropServices;
using Avatar;
using DefaultNamespace;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Utils.Injection;

public class Bootstrap : InjectableBehaviour
{
    [SerializeField] private Text label;

    [Inject] private AccountModel _account;
    [Inject] private DataController _data;
    
    
    [DllImport("__Internal")]
    private static extern void SignIn();

    private async void Start()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        SignIn();
#else
        HandleWalletId(DefaultAddress);
#endif
    }

    private const string DefaultAddress = "BuVZKpTAitHQ1wFSZELocdhK7gTyn9gTfYU6C7zGdS3Q";


    private async void HandleWalletId(string value)
    {
        _account.Id = value;
        label.text = "Authenticated as " + value;

        await _data.Refresh();

        SceneManager.LoadScene("MainArea");
    }
}