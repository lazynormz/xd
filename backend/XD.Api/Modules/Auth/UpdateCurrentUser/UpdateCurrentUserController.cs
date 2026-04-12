using Microsoft.AspNetCore.Mvc;
using XD.Api.Modules.Auth;
using XD.Api.contracts;
using XD.Application.Auth.Dtos;
using XD.Application.Auth.UpdateCurrentUser;

namespace XD.Api.Modules.Auth.UpdateCurrentUser;

[Route("api/auth/me")]
public sealed class UpdateCurrentUserController : BaseController
{
    [HttpPut]
    [ProducesResponseType<AuthenticatedUserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthenticatedUserDto>> PutAsync(
        [FromBody] UpdateCurrentUserRequest request,
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

        var result = await Mediator.Send(
            new UpdateCurrentUserCommand(userId.Value, request.DisplayName),
            cancellationToken);

        if (result.UserNotFound)
        {
            return Unauthorized(new ProblemDetails
            {
                Detail = "The token does not map to an active account.",
                Status = StatusCodes.Status401Unauthorized,
                Title = "User not found."
            });
        }

        if (result.DisplayNameAlreadyExists)
        {
            return Conflict(new ProblemDetails
            {
                Detail = "That display name is already in use.",
                Status = StatusCodes.Status409Conflict,
                Title = "Display name unavailable."
            });
        }

        return Ok(result.User);
    }
}
