using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp",
                builder =>
                {
                    var angularOrigin = _configuration.GetValue<string>("AllowedOrigins:Angular") ?? string.Empty;

                    builder.WithOrigins(angularOrigin)
                           .WithMethods("GET", "POST", "PUT", "DELETE")
                           .WithHeaders("Authorization", "Content-Type");
                });
        });

        services.AddControllers();
        services.AddSingleton<ToDoService>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();

        app.UseCors("AllowAngularApp");

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}