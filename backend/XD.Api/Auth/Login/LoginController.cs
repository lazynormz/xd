using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XD.Api.contracts;
using XD.Application.Auth.Dtos;
using XD.Application.Auth.LoginUser;

namespace XD.Api.Auth.Login;

[AllowAnonymous]
[Route("api/auth/login")]
public sealed class LoginController : BaseController
{
    [HttpPost]
    [ProducesResponseType<AuthenticationResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthenticationResponseDto>> PostAsync(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var response = await Mediator.Send(
            new LoginUserCommand(request.Email, request.Password),
            cancellationToken);

        if (response is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Detail = "The email address or password is incorrect.",
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid credentials."
            });
        }

        return Ok(response);
    }
}
