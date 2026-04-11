using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace XD.Api;

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .GroupBy(error => error.PropertyName)
                .ToDictionary(
                    grouping => grouping.Key,
                    grouping => grouping.Select(error => error.ErrorMessage).Distinct().ToArray());

            var validationProblemDetails = new ValidationProblemDetails(errors)
            {
                Detail = "One or more validation errors occurred.",
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed."
            };

            httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

            await httpContext.Response.WriteAsJsonAsync(validationProblemDetails, cancellationToken);

            return true;
        }

        logger.LogError(exception, "Unhandled exception while processing {Path}.", httpContext.Request.Path);

        var problemDetails = new ProblemDetails
        {
            Detail = "An unexpected error occurred.",
            Status = StatusCodes.Status500InternalServerError,
            Title = "Server error."
        };

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
