using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XD.Api.contracts;

namespace XD.Api.Modules.games;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class GamesController : BaseController
{
    [HttpGet]
    public IActionResult GetGames()
    {
        // Your logic to get games
        return Ok();
    }
}
