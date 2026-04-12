using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XD.Api.contracts;
using XD.Application.Auth.Dtos;
using XD.Application.Auth.RegisterUser;

namespace XD.Api.Modules.Auth.Register;

[AllowAnonymous]
[Route("api/auth/register")]
public sealed class RegisterController : BaseController
{
    [HttpPost]
    [ProducesResponseType<AuthenticationResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthenticationResponseDto>> PostAsync(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(
            new RegisterUserCommand(request.Email, request.Password, request.Username),
            cancellationToken);

        if (result.EmailAlreadyExists)
        {
            return Conflict(new ProblemDetails
            {
                Detail = "An account with that email address already exists.",
                Status = StatusCodes.Status409Conflict,
                Title = "Email already registered."
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

        return Ok(result.Authentication!);
    }
}
