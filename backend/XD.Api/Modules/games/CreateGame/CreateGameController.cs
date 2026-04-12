using Microsoft.AspNetCore.Mvc;
using XD.Api.Modules.Auth;
using XD.Api.contracts;
using XD.Application.Games.CreateGame;
using XD.Application.Games.Dtos;

namespace XD.Api.Modules.Games.CreateGame;

[Route("api/games")]
public sealed class CreateGameController : BaseController
{
    [HttpPost]
    [ProducesResponseType<GameDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<GameDto>> PostAsync(
        [FromBody] CreateGameRequest request,
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

        var game = await Mediator.Send(
            new CreateGameCommand(
                userId.Value,
                request.Title,
                request.Description,
                request.PriceEur,
                request.Genre),
            cancellationToken);

        return Ok(game);
    }
}
