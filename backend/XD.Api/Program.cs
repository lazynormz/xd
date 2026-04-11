namespace XD.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        builder
            .Configuration
            .SetBasePath(new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory).FullName)
            .AddJsonFile("appsettings.json", false)
            .AddJsonFile($"appsettings.{environment}.json", false);

        builder.Services.AddApi(builder.Configuration);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // app.UseCors();

        // app.UseHttpsRedirection();

        // app.UseExceptionHandler();

        // app.UseAuthentication();

        // app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}