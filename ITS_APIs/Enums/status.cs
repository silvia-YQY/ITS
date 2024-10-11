namespace ITS_APIs.Enums;


// Enum for Status
public enum OrderStatus
{
  Confirm,
  Done,
  Cancel,
  Pending
}

public enum RoleType
{
  admin,  // Matches the values in the ENUM in SQL
  user
}
