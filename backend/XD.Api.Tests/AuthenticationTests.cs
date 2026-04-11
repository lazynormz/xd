using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace XD.Api.Tests;

public sealed class AuthenticationTests(ApiWebApplicationFactory factory)
    : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _httpClient = factory.CreateClient();

    [Fact]
    public async Task LoginAsync_ReturnsJwtForSeededUser()
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest("friend@example.com", "Password123!"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var authentication = await response.Content.ReadFromJsonAsync<AuthenticationResponse>();

        Assert.NotNull(authentication);
        Assert.False(string.IsNullOrWhiteSpace(authentication.AccessToken));
        Assert.Equal("Bearer", authentication.TokenType);
        Assert.Equal("friend@example.com", authentication.User.Email);
    }

    [Fact]
    public async Task LoginAsync_ReturnsUnauthorizedForInvalidCredentials()
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest("friend@example.com", "wrong-password"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCurrentUserAsync_ReturnsCurrentUserForValidBearerToken()
    {
        var authentication = await LoginAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authentication.AccessToken);

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var currentUser = await response.Content.ReadFromJsonAsync<AuthenticatedUserResponse>();

        Assert.NotNull(currentUser);
        Assert.Equal("friend@example.com", currentUser.Email);
    }

    private async Task<AuthenticationResponse> LoginAsync()
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest("friend@example.com", "Password123!"));

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<AuthenticationResponse>())!;
    }

    private sealed record LoginRequest(string Email, string Password);

    private sealed record AuthenticationResponse(
        string AccessToken,
        string TokenType,
        DateTimeOffset ExpiresAtUtc,
        AuthenticatedUserResponse User);

    private sealed record AuthenticatedUserResponse(Guid Id, string Email);
}
