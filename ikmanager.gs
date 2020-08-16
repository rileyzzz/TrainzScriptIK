include "IKLink.gs"
include "Soup.gs"

class IKManager
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

  public void UpdateIKTransforms(float TargetX, float TargetY, float TargetZ)
  {
    IKCoordinate Target = new IKCoordinate();
    Target.x = TargetX;
    Target.y = TargetY;
    Target.z = TargetZ;
    //several iterations
    int i;
    for(i = 0; i < 5; i++)
    {
      Links[0].UpdateIK(Target);
    }

  }
};
