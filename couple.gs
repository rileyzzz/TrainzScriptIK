include "MeshObject.gs"
include "MapObject.gs"
include "IKManager.gs"

class IKCoupler isclass MapObject
{
  Browser browser;
  IKManager IKSystem;
  //definitions
  void ConstructBrowser();
  string GetWindowHTML();
  thread void IKThread();
  public void Init()
  {
    inherited();

    IKSystem = new IKManager();
    IKSystem.BuildIKSystem(3, me);

    ConstructBrowser();
    IKThread();
  }

  thread void IKThread()
  {
    while(true)
    {
      string Xstr = browser.GetElementProperty("Xtarg", "value");
      string Ystr = browser.GetElementProperty("Ytarg", "value");
      string Zstr = browser.GetElementProperty("Ztarg", "value");

      float TargetX = Str.ToFloat(Xstr) / 40.0;
      float TargetY = Str.ToFloat(Ystr) / 40.0;
      float TargetZ = Str.ToFloat(Zstr) / 40.0;

      SetMeshTranslation("target", TargetX, TargetY, TargetZ);
      //SetMeshOrientation("link1", TargetX, 0.0, 0.0);
      IKSystem.UpdateIKTransforms(TargetX, TargetY, TargetZ);
      Sleep(0.02);
    }
  }

  void ConstructBrowser()
  {
    browser = null;
    if ( !browser )	browser = Constructors.NewBrowser();

    browser.SetCloseEnabled(true);
  	browser.SetWindowPosition(Interface.GetDisplayWidth() - 320, Interface.GetDisplayHeight() - 525);
  	browser.SetWindowSize(300, 350);
  	browser.SetWindowVisible(true);
  	browser.LoadHTMLString(GetAsset(), GetWindowHTML());
  }

  string GetWindowHTML()
  {
    HTMLBuffer output = HTMLBufferStatic.Construct();
    output.Print("<html><body>");
    output.Print("<table>");

    //Options
    output.Print("<tr><td>");
    output.Print("<font><b>IK Controls</font>");
    output.Print("</tr></td>");

    //controls
    output.Print("<tr><td>");
    output.Print("X:");
    output.Print("<br>");
    output.Print("<trainz-object style=slider horizontal theme=standard-slider width=300 height=20 id='Xtarg' min=-38 max=38 value=0.0 page-size=0></trainz-object>");
    output.Print("</tr></td>");

    output.Print("<tr><td>");
    output.Print("Y:");
    output.Print("<br>");
    output.Print("<trainz-object style=slider horizontal theme=standard-slider width=300 height=20 id='Ytarg' min=-38 max=38 value=0.0 page-size=0></trainz-object>");
    output.Print("</tr></td>");

    output.Print("<tr><td>");
    output.Print("Z:");
    output.Print("<br>");
    output.Print("<trainz-object style=slider horizontal theme=standard-slider width=300 height=20 id='Ztarg' min=-38 max=38 value=0.0 page-size=0></trainz-object>");
    output.Print("</tr></td>");

    output.Print("</table>");
    output.Print("</body></html>");

    return output.AsString();
  }
};
