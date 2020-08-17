include "IKLink.gs"
include "Library.gs"
include "Soup.gs"

class IKManager isclass Library
{
  IKLink[] Links;
  public MeshObject MainObject;
  public void BuildIKSystem(int LinkCount, MeshObject obj)
  {
    MainObject = obj;
    Links = new IKLink[LinkCount];

    //Set link defaults
    Soup ExtensionsContainer = MainObject.GetAsset().GetConfigSoup().GetNamedSoup("extensions");
    Soup Lengths = ExtensionsContainer.GetNamedSoup("IKLengths");
    int i;
    for(i = 0; i < Links.size(); i++)
    {
      Links[i] = new IKLink();
      //Links[i].r_x = 0.1;
      Links[i].ID = i;
      Links[i].MainObject = MainObject;
      Links[i].length = Str.ToFloat(Lengths.GetNamedTag("link" + (string)i));
    }

    for(i = 0; i < Links.size() - 1; i++)
    {
      Links[i].child = Links[i + 1];
      Links[i + 1].parent = Links[i];
    }
  }

  public void SetLinkRotation(int LinkID, float r_x, float r_y, float r_z)
  {
    Links[LinkID].r_x = r_x;
    Links[LinkID].r_y = r_y;
    Links[LinkID].r_z = r_z;
  }

  public void SetLinkLength(int LinkID, float length)
  {
    Links[LinkID].length = length;
  }

  public void UpdateIKTransforms(float TargetX, float TargetY, float TargetZ)
  {
    IKCoordinate Target = new IKCoordinate();
    Target.x = TargetX;
    Target.y = TargetY;
    Target.z = TargetZ;

    //rotate link 0 towards Target
    Links[0].r_z = IKMath.ApproxAtan2(-Target.y - 0.078508, Target.x) - (Math.PI / 2);

    //several iterations
    int i;
    for(i = 0; i < 5; i++)
    {
      Links[0].UpdateIK(Target);
    }
  }
};
