using Avatar;
using CityBuilding;
using DefaultNamespace;
using Utils.Injection;

public class RequestTurnEnd : InjectableBehaviour
{
    [Inject] private TurnService _service;
    [Inject] private AccountModel _account;
    [Inject] private DataController _data;

    public async void SubmitTurn()
    {
        await _service.SubmitTurn(_account.Id);

        await _data.Refresh();
    }
}
