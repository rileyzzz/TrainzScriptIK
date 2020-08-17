include "gs.gs"

class IKCoordinate
{
  public float x = 0.0;
  public float y = 0.0;
  public float z = 0.0;
  public string AsString()
  {
    return "X: " + (string)x + " Y: " + (string)y + " Z: " + (string)z;
  }
};

static class IKMath
{
  public define float PI_2 = 3.14159265/2.0;

  public float ApproxAtan(float z)
  {
      float n1 = 0.97239411;
      float n2 = -0.19194795;
      return (n1 + n2 * z * z) * z;
  }

  public float ApproxAtan2(float y, float x)
  {
      if (x != 0.0)
      {
          if (Math.Fabs(x) > Math.Fabs(y))
          {
              float z = y / x;
              if (x > 0.0)
              {
                  // atan2(y,x) = atan(y/x) if x > 0
                  return ApproxAtan(z);
              }
              else if (y >= 0.0)
              {
                  // atan2(y,x) = atan(y/x) + PI if x < 0, y >= 0
                  return ApproxAtan(z) + Math.PI;
              }
              else
              {
                  // atan2(y,x) = atan(y/x) - PI if x < 0, y < 0
                  return ApproxAtan(z) - Math.PI;
              }
          }
          else // Use property atan(y/x) = PI/2 - atan(x/y) if |y/x| > 1.
          {
              float z = x / y;
              if (y > 0.0)
              {
                  // atan2(y,x) = PI/2 - atan(x/y) if |y/x| > 1, y > 0
                  return -ApproxAtan(z) + PI_2;
              }
              else
              {
                  // atan2(y,x) = -PI/2 - atan(x/y) if |y/x| > 1, y < 0
                  return -ApproxAtan(z) - PI_2;
              }
          }
      }
      else
      {
          if (y > 0.0) // x = 0, y > 0
          {
              return PI_2;
          }
          else if (y < 0.0) // x = 0, y < 0
          {
              return -PI_2;
          }
      }
      return 0.0; // x,y = 0. Could return NaN instead.
  }

  public define int SINETIMEOUT = 512;
    public float fast_sin(float in_x) {
      float x = in_x;
      //always wrap input angle to -PI..PI
      if(x and x != 0.0)
      {
        int Timeout = 0;
        if (x < -(float)Math.PI)
            while(Timeout < SINETIMEOUT and x < -(float)Math.PI)
            {
              x = x + (float)Math.PI * 2;
              Timeout++;
            }
        if (x > (float)Math.PI)
            while(Timeout < SINETIMEOUT and x > (float)Math.PI)
            {
              x = x - (float)Math.PI * 2;
              Timeout++;
            }
      }


      //compute sine
      if (x < 0)
      {
          float sin = (4 / (float)Math.PI) * x + (4 / (float)(Math.PI * Math.PI)) * x * x;

          if (sin < 0)
              return .225 * (sin * -sin - sin) + sin;

          return .225 * (sin * sin - sin) + sin;
      }
      else
      {
          float sin = (4 / (float)Math.PI) * x - (4 / (float)(Math.PI * Math.PI)) * x * x;

          if (sin < 0)
              return .225 * (sin * -sin - sin) + sin;

          return .225 * (sin * sin - sin) + sin;
      }
      return 0.0;
  }

  public float fast_cos(float x)
  {
    return fast_sin((Math.PI / 2.0) - x);
  }

  public IKCoordinate TranslatePoint(IKCoordinate point, float h, float v)
  {
    IKCoordinate newpoint = new IKCoordinate();
    newpoint.x = point.x;
    newpoint.y = point.y + h;
    newpoint.z = point.z + v;
    return newpoint;
  }
  public IKCoordinate RotatePoint(IKCoordinate point, float rotateangle)
  {
    IKCoordinate newpoint = new IKCoordinate();
    newpoint.x = point.x;
    newpoint.y = point.y * fast_cos(rotateangle) - point.z * fast_sin(rotateangle);
    newpoint.z = point.y * fast_sin(rotateangle) + point.z * fast_cos(rotateangle);
    return newpoint;
  }
  public float Angle(IKCoordinate point)
  {
    float newangle = ApproxAtan2(point.z, point.y);
    return newangle;
  }
};
