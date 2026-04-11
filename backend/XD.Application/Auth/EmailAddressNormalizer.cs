namespace XD.Application.Auth;

public static class EmailAddressNormalizer
{
    public static string Normalize(string emailAddress)
    {
        return emailAddress.Trim().ToUpperInvariant();
    }

    public static string Sanitize(string emailAddress)
    {
        return emailAddress.Trim().ToLowerInvariant();
    }
}
