using Microsoft.AspNetCore.Mvc;
using XD.Api.Modules.Auth;
using XD.Api.contracts;
using XD.Application.Games.Dtos;
using XD.Application.Games.JoinGame;

namespace XD.Api.Modules.Games.JoinGame;

[Route("api/games/{gameId:guid}/interest")]
public sealed class JoinGameController : BaseController
{
    [HttpPost]
    [ProducesResponseType<GameDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GameDto>> PostAsync(
        Guid gameId,
        CancellationToken cancellationToken)
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

        var game = await Mediator.Send(new JoinGameCommand(gameId, userId.Value), cancellationToken);

        if (game is null)
        {
            return NotFound(new ProblemDetails
            {
                Detail = "The requested game was not found.",
                Status = StatusCodes.Status404NotFound,
                Title = "Game not found."
            });
        }

        return Ok(game);
    }
}
