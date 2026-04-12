using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace XD.Api.Tests;

public sealed class AuthenticationTests(ApiWebApplicationFactory factory)
    : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _httpClient = factory.CreateClient();

    [Fact]
    public async Task LoginAsync_ReturnsJwtForRegisteredUser()
    {
        var emailAddress = CreateUniqueEmailAddress();
        await RegisterAsync(emailAddress, "Password123!");

        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(emailAddress, "Password123!"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var authentication = await response.Content.ReadFromJsonAsync<AuthenticationResponse>();

        Assert.NotNull(authentication);
        Assert.False(string.IsNullOrWhiteSpace(authentication.AccessToken));
        Assert.Equal("Bearer", authentication.TokenType);
        Assert.Equal(emailAddress, authentication.User.Email);
        AssertGeneratedDisplayName(authentication.User.DisplayName);
    }

    [Fact]
    public async Task LoginAsync_ReturnsUnauthorizedForInvalidCredentials()
    {
        var emailAddress = CreateUniqueEmailAddress();
        await RegisterAsync(emailAddress, "Password123!");

        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(emailAddress, "wrong-password"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCurrentUserAsync_ReturnsCurrentUserForValidBearerToken()
    {
        var emailAddress = CreateUniqueEmailAddress();
        var authentication = await RegisterAsync(emailAddress, "Password123!");
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authentication.AccessToken);

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var currentUser = await response.Content.ReadFromJsonAsync<AuthenticatedUserResponse>();

        Assert.NotNull(currentUser);
        Assert.Equal(emailAddress, currentUser.Email);
        AssertGeneratedDisplayName(currentUser.DisplayName);
    }

    [Fact]
    public async Task RegisterAsync_AssignsUniqueDisplayNamesToNewUsers()
    {
        var firstUser = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var secondUser = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");

        AssertGeneratedDisplayName(firstUser.User.DisplayName);
        AssertGeneratedDisplayName(secondUser.User.DisplayName);
        Assert.NotEqual(firstUser.User.DisplayName, secondUser.User.DisplayName);
    }

    [Fact]
    public async Task UpdateCurrentUserAsync_UpdatesDisplayNameForAuthenticatedUser()
    {
        var authentication = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var displayName = $"captain_{Guid.NewGuid():N}";
        var request = CreateAuthorizedRequest(HttpMethod.Put, "/api/auth/me", authentication.AccessToken);
        request.Content = JsonContent.Create(new UpdateCurrentUserRequest(displayName));

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var updatedUser = await response.Content.ReadFromJsonAsync<AuthenticatedUserResponse>();

        Assert.NotNull(updatedUser);
        Assert.Equal(displayName, updatedUser.DisplayName);

        var currentUser = await GetCurrentUserAsync(authentication.AccessToken);

        Assert.Equal(displayName, currentUser.DisplayName);
    }

    [Fact]
    public async Task UpdateCurrentUserAsync_ReturnsConflictForExistingDisplayName()
    {
        var firstUser = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var secondUser = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var request = CreateAuthorizedRequest(HttpMethod.Put, "/api/auth/me", secondUser.AccessToken);
        request.Content = JsonContent.Create(new UpdateCurrentUserRequest(firstUser.User.DisplayName));

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task UpdateCurrentUserAsync_ReturnsBadRequestForInvalidDisplayName()
    {
        var authentication = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var request = CreateAuthorizedRequest(HttpMethod.Put, "/api/auth/me", authentication.AccessToken);
        request.Content = JsonContent.Create(new UpdateCurrentUserRequest("display name with spaces"));

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetGamesAsync_ReturnsCreatedGameWithInterestedUsers()
    {
        var firstUserEmailAddress = CreateUniqueEmailAddress();
        var secondUserEmailAddress = CreateUniqueEmailAddress();
        var firstUserAuthentication = await RegisterAsync(firstUserEmailAddress, "Password123!");
        var secondUserAuthentication = await RegisterAsync(secondUserEmailAddress, "Password123!");

        var createdGame = await CreateGameAsync(
            firstUserAuthentication.AccessToken,
            new CreateGameRequest(
                "Helldivers 2",
                "Co-op chaos on weekend nights.",
                39.99m,
                "Co-op Shooter"));

        Assert.Equal("Helldivers 2", createdGame.Title);
        Assert.True(createdGame.CurrentUserWantsToPlay);
        Assert.Single(createdGame.InterestedUsers);
        Assert.Equal(firstUserEmailAddress, createdGame.InterestedUsers[0].Email);
        AssertGeneratedDisplayName(createdGame.InterestedUsers[0].DisplayName);

        var joinedGame = await JoinGameAsync(secondUserAuthentication.AccessToken, createdGame.Id);

        Assert.Equal(createdGame.Id, joinedGame.Id);
        Assert.Equal(2, joinedGame.InterestedUsers.Count);
        Assert.Contains(
            joinedGame.InterestedUsers,
            interestedUser => interestedUser.Email == secondUserEmailAddress);
        Assert.All(
            joinedGame.InterestedUsers,
            interestedUser => Assert.False(string.IsNullOrWhiteSpace(interestedUser.DisplayName)));

        var firstUserGames = await GetGamesAsync(firstUserAuthentication.AccessToken);
        var secondUserGames = await GetGamesAsync(secondUserAuthentication.AccessToken);

        var gameForFirstUser = Assert.Single(firstUserGames, game => game.Id == createdGame.Id);
        var gameForSecondUser = Assert.Single(secondUserGames, game => game.Id == createdGame.Id);

        Assert.True(gameForFirstUser.CurrentUserWantsToPlay);
        Assert.True(gameForSecondUser.CurrentUserWantsToPlay);
        Assert.Equal(2, gameForFirstUser.InterestedUsers.Count);
        Assert.Equal(2, gameForSecondUser.InterestedUsers.Count);
    }

    [Fact]
    public async Task CreateGameAsync_ReturnsBadRequestForInvalidPayload()
    {
        var authentication = await RegisterAsync(CreateUniqueEmailAddress(), "Password123!");
        var request = CreateAuthorizedRequest(
            HttpMethod.Post,
            "/api/games",
            authentication.AccessToken);

        request.Content = JsonContent.Create(new CreateGameRequest("", "", -1m, ""));

        var response = await _httpClient.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task<AuthenticationResponse> LoginAsync()
    {
        var emailAddress = CreateUniqueEmailAddress();
        await RegisterAsync(emailAddress, "Password123!");

        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(emailAddress, "Password123!"));

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<AuthenticationResponse>())!;
    }

    private async Task<AuthenticationResponse> RegisterAsync(string email, string password)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/register",
            new LoginRequest(email, password));

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<AuthenticationResponse>())!;
    }

    private async Task<GameResponse> CreateGameAsync(string accessToken, CreateGameRequest requestBody)
    {
        var request = CreateAuthorizedRequest(HttpMethod.Post, "/api/games", accessToken);
        request.Content = JsonContent.Create(requestBody);

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<GameResponse>())!;
    }

    private async Task<GameResponse[]> GetGamesAsync(string accessToken)
    {
        var request = CreateAuthorizedRequest(HttpMethod.Get, "/api/games", accessToken);
        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<GameResponse[]>())!;
    }

    private async Task<GameResponse> JoinGameAsync(string accessToken, Guid gameId)
    {
        var request = CreateAuthorizedRequest(HttpMethod.Post, $"/api/games/{gameId}/interest", accessToken);
        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<GameResponse>())!;
    }

    private async Task<AuthenticatedUserResponse> GetCurrentUserAsync(string accessToken)
    {
        var request = CreateAuthorizedRequest(HttpMethod.Get, "/api/auth/me", accessToken);
        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<AuthenticatedUserResponse>())!;
    }

    private static HttpRequestMessage CreateAuthorizedRequest(
        HttpMethod method,
        string uri,
        string accessToken)
    {
        var request = new HttpRequestMessage(method, uri);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return request;
    }

    private static string CreateUniqueEmailAddress()
    {
        return $"friend-{Guid.NewGuid():N}@example.com";
    }

    private static void AssertGeneratedDisplayName(string displayName)
    {
        Assert.False(string.IsNullOrWhiteSpace(displayName));
        Assert.StartsWith("username", displayName, StringComparison.Ordinal);
    }

    private sealed record LoginRequest(string Email, string Password);

    private sealed record AuthenticationResponse(
        string AccessToken,
        string TokenType,
        DateTimeOffset ExpiresAtUtc,
        AuthenticatedUserResponse User);

    private sealed record AuthenticatedUserResponse(Guid Id, string Email, string DisplayName);

    private sealed record UpdateCurrentUserRequest(string DisplayName);

    private sealed record CreateGameRequest(
        string Title,
        string Description,
        decimal PriceEur,
        string Genre);

    private sealed record GameInterestedUserResponse(Guid Id, string DisplayName, string Email);

    private sealed record GameResponse(
        Guid Id,
        string Title,
        string Description,
        decimal PriceEur,
        string Genre,
        bool CurrentUserWantsToPlay,
        IReadOnlyList<GameInterestedUserResponse> InterestedUsers);
}
