include "Orientation.gs"
include "MeshObject.gs"
include "MathPlus.gs"
include "IKMath.gs"
class IKLink
{
  public float r_x = 0.0;
  public float r_y = 0.0;
  public float r_z = 0.0;
  public float length;
  public int ID;
  public MeshObject MainObject;
  public IKLink parent;
  public IKLink child;
  public void ApplyTransform()
  {
    if(r_x < -Math.PI) r_x = r_x + Math.PI * 2;
    if(r_x > -Math.PI) r_x = r_x - Math.PI * 2;
    MainObject.SetMeshOrientation("link" + (string)ID, r_x, r_y, r_z);
  }

  public IKCoordinate GetLocation()
  {
    IKCoordinate ReturnCoord = new IKCoordinate();
    if(parent)
    {
      ReturnCoord.x = 0.0;
      ReturnCoord.y = parent.length;
      ReturnCoord.z = 0.0;
    }
    else
    {
      ReturnCoord.x = 0.0;
      ReturnCoord.y = 0.0;
      ReturnCoord.z = 0.0;
    }
    return ReturnCoord;
  }

  public IKCoordinate UpdateIK(IKCoordinate target)
  {
    IKCoordinate MyLocation = GetLocation();

    IKCoordinate LocalLocation = IKMath.TranslatePoint(target, -MyLocation.y, -MyLocation.z);
    IKCoordinate localTarget = IKMath.RotatePoint(LocalLocation, -r_x);

    IKCoordinate endPoint = new IKCoordinate();
    if (child) {
      endPoint = child.UpdateIK(localTarget);
    } else {
      // base case:  the end point is the end of the current bone
      //endPoint = [this.length, 0];
      endPoint.y = length;
    }

    // point towards the endpoint
    float shiftAngle = IKMath.Angle(localTarget) - IKMath.Angle(endPoint);
    r_x = r_x + shiftAngle + 0.1;

    ApplyTransform();

    // convert back to parent coordinate space
    IKCoordinate ParentRotation = IKMath.RotatePoint(endPoint, r_x);
    IKCoordinate ParentLocation = IKMath.TranslatePoint(ParentRotation, MyLocation.y, MyLocation.z);
    return ParentLocation;
  }
};
