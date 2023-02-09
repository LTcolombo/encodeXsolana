using CityBuilding;
using UnityEngine;

[RequireComponent(typeof(Outline))]
[RequireComponent(typeof(Collider))]
public class ShowInfo : MonoBehaviour
{
    private Collider _selectionCollider;
    private Camera _camera;

    [SerializeField] private BuildingInfo _info;
    public BuildingData Data;

    void Start()
    {
        _camera = Camera.main;

        _info = Instantiate(_info, GameObject.Find("HUD").transform);

        _selectionCollider = GetComponent<Collider>();
    }

    
    
    void Update()
    {
        var mouseRay = _camera.ScreenPointToRay(Input.mousePosition);
        if (_selectionCollider != null)
        {
            _info.gameObject.SetActive(_selectionCollider.bounds.IntersectRay(mouseRay, out _));
            _info.SetData(Data);
            _info.transform.position = Input.mousePosition;
        }
    }
}