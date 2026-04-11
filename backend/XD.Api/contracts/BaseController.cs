using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace XD.Api.contracts;

[ApiController]
public class BaseController : ControllerBase
{
    private ISender? _mediator;

    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}
