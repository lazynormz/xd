namespace XD.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder
            .Configuration
            .SetBasePath(new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory).FullName)
            .AddJsonFile("appsettings.json", false)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true)
            .AddUserSecrets<Program>(optional: true)
            .AddEnvironmentVariables();

        builder.Services.AddApi(builder.Configuration);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(DependencyInjection.FrontendCorsPolicyName);

        // app.UseHttpsRedirection();

        app.UseExceptionHandler();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        await app.InitializeDatabaseAsync();

        await app.RunAsync();
    }
}
