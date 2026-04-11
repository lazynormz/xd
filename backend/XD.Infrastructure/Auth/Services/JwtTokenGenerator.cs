using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using XD.Application.Auth.Contracts;
using XD.Application.Auth.Dtos;
using XD.Domain.Auth;
using XD.Infrastructure.Auth.Configuration;

namespace XD.Infrastructure.Auth.Services;

public sealed class JwtTokenGenerator(JwtOptions jwtOptions, TimeProvider timeProvider) : IJwtTokenGenerator
{
    public AuthenticationResponseDto GenerateToken(User user)
    {
        var now = timeProvider.GetUtcNow();
        var expiresAtUtc = now.AddMinutes(jwtOptions.AccessTokenExpirationMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            audience: jwtOptions.Audience,
            claims: claims,
            expires: expiresAtUtc.UtcDateTime,
            issuer: jwtOptions.Issuer,
            notBefore: now.UtcDateTime,
            signingCredentials: signingCredentials);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new AuthenticationResponseDto(
            accessToken,
            "Bearer",
            expiresAtUtc,
            AuthenticatedUserDto.FromUser(user));
    }
}
