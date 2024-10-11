namespace ITS_APIs.Enums;


// Enum for Status
public enum OrderStatus
{
  Confirm = 0,
  Pending = 1,
  Done = 2,
  Cancel = 3
}


public enum RoleType
{
  user,
  admin // Matches the values in the ENUM in SQL
}
