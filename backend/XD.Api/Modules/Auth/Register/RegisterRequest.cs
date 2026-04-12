namespace XD.Api.Modules.Auth.Register;

public sealed record RegisterRequest(string Email, string Password, string Username);
