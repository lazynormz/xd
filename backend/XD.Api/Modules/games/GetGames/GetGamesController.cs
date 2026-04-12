using Microsoft.AspNetCore.Mvc;
using XD.Api.Modules.Auth;
using XD.Api.contracts;
using XD.Application.Games.Dtos;
using XD.Application.Games.GetGames;

namespace XD.Api.Modules.Games.GetGames;

[Route("api/games")]
public sealed class GetGamesController : BaseController
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<GameDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyList<GameDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var userId = User.TryGetUserId();

        if (userId is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Detail = "The supplied access token is missing a valid subject claim.",
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid token."
            });
        }

        var games = await Mediator.Send(new GetGamesQuery(userId.Value), cancellationToken);

        return Ok(games);
    }
}
