using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XD.Api.contracts;
using XD.Application.Auth.Dtos;
using XD.Application.Auth.RegisterUser;

namespace XD.Api.Auth.Register;

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
        var response = await Mediator.Send(
            new RegisterUserCommand(request.Email, request.Password),
            cancellationToken);

        if (response is null)
        {
            return Conflict(new ProblemDetails
            {
                Detail = "An account with that email address already exists.",
                Status = StatusCodes.Status409Conflict,
                Title = "Email already registered."
            });
        }

        return Ok(response);
    }
}
