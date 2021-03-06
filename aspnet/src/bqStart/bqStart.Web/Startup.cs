using BinaryQuest.Framework.Core.Extensions;
using BinaryQuest.Framework.Core.Security;
using bqStart.Data;
using bqStart.Web.Controllers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
//using bqStart.Web.Controllers;
using Serilog;
using TimeZoneConverter;
using Microsoft.AspNetCore.Identity.UI.Services;
using BinaryQuest.Framework.Identity;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Models;

namespace bqStart.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));

            services.AddDbContext<MainDataContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));

            services.AddDefaultIdentityWithBQUI<ApplicationUser>(options =>  options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<MainDataContext>();


            services.AddSingleton<ICorsPolicyService>((container) => {
                var logger = container.GetRequiredService<ILogger<DefaultCorsPolicyService>>();
                return new DefaultCorsPolicyService(logger)
                {
                    //AllowedOrigins = { "https://localhost:44301", "app://localhost" },
                    AllowAll = true
                };
            });

            services.AddCors(opt => {
                opt.AddDefaultPolicy(opt => opt.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            });

            services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, MainDataContext>(opt => {                

                var nativeClient = ClientBuilder
                    .NativeApp("electronapp")
                    .WithRedirectUri("app://localhost/authentication/login-callback")
                    .WithRedirectUri("https://oauth.pstmn.io/v1/callback")
                    .WithLogoutRedirectUri("app://localhost/authentication/logout-callback")
                    .WithScopes("openid profile bqStart.WebAPI offline_access")
                    .Build();

                nativeClient.AllowedCorsOrigins = new[]
                {
                    "app://localhost"
                };

                opt.Clients.Add(nativeClient);

                var apiClient = new Client
                {
                    ClientId = "cmsclient",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    // secret for authentication
                    ClientSecrets =
                        {
                            new Secret("secret".Sha256())
                        },

                    // scopes that client has access to
                    AllowedScopes = { "bqStart.WebAPI" }
                };

                opt.Clients.Add(apiClient);
            })
                .AddProfileService<ProfileService<ApplicationUser>>();
            
            services.AddAuthentication()
                .AddIdentityServerJwt()
                //.AddGoogle(options =>
                //{                    
                //    options.ClientId = Configuration["ExternalProviders:OAuth:GoogleClientId"];
                //    options.ClientSecret = Configuration["ExternalProviders:OAuth:GoogleSecret"];
                //});
                ;            
            
            //BQ Admin related
            services.AddBqAdminServices<ApplicationUser, MainDataContext>(options =>
                options.SetApplicationName("BQ Start")
                .SetAllowUserRegistration(false)
                .SetDefaultAdminRole(Configuration["defaultAdminRole"])
                .SetDefaultTimeZone(TZConvert.GetTimeZoneInfo("Asia/Dhaka"))
                .SetDefaultLanguage("en_US")
                .SetSecurityRulesProvider(new FileBasedSecurityRulesProvider("config"))
                .RegisterController<IdentityRole, IdentityRoleController>()
                .RegisterController<ApplicationUser, ApplicationUserController>()
                .RegisterController<Department, DepartmentController>()
                .RegisterController<ExampleClass, ExampleClassController>()
                .RegisterController<Order, OrderController>()
                );            

            services.AddRazorPages().AddRazorRuntimeCompilation();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });

            //Setup email sending services here
            services.Configure<EmailSenderOptions>(options => Configuration.GetSection("ExternalProviders:SMTP").Bind(options));
            services.AddTransient<IEmailSender, EmailSender>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger("Startup");

            if (env.IsDevelopment())
            {
                logger.LogDebug("Startup Configure Stage DEBUG");
                app.UseDeveloperExceptionPage();                
                app.UseODataRouteDebug();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseCors();

            //load all middlewares we need from the framework
            //and register the endpoints we will need for data
            app.UseBQAdmin<MainDataContext>().Build();

            

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                    //spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }        
    }
}
