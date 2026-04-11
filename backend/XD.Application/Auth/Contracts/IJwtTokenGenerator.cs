using XD.Application.Auth.Dtos;
using XD.Domain.Auth;

namespace XD.Application.Auth.Contracts;

public interface IJwtTokenGenerator
{
    AuthenticationResponseDto GenerateToken(User user);
}
