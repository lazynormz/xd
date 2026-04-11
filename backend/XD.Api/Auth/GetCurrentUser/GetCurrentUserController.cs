using Microsoft.AspNetCore.Mvc;
using XD.Api.Auth;
using XD.Api.contracts;
using XD.Application.Auth.Dtos;
using XD.Application.Auth.GetCurrentUser;

namespace XD.Api.Auth.GetCurrentUser;

[Route("api/auth/me")]
public sealed class GetCurrentUserController : BaseController
{
    [HttpGet]
    [ProducesResponseType<AuthenticatedUserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthenticatedUserDto>> GetAsync(CancellationToken cancellationToken)
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

        var currentUser = await Mediator.Send(new GetCurrentUserQuery(userId.Value), cancellationToken);

        if (currentUser is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Detail = "The token does not map to an active account.",
                Status = StatusCodes.Status401Unauthorized,
                Title = "User not found."
            });
        }

        return Ok(currentUser);
    }
}
