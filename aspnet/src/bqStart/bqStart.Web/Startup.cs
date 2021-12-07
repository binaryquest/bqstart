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

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<MainDataContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, MainDataContext>()
                .AddProfileService<ProfileService<ApplicationUser>>();

            services.AddAuthentication()
                .AddIdentityServerJwt().AddGoogle(options =>
                {
                    //IConfigurationSection googleAuthNSection =
                    //    Configuration.GetSection("Authentication:Google");

                    options.ClientId = "sdfsdf";//googleAuthNSection["ClientId"];
                    options.ClientSecret = "sdfsdf";// googleAuthNSection["ClientSecret"];
                });

            //services.AddControllersWithViews().AddNewtonsoftJson();            

            //BQ Admin related
            services.AddBqAdminServices<ApplicationUser, MainDataContext>(options =>
                options.SetApplicationName("PDCL MIS")
                .SetAllowUserRegistration(false)
                .SetDefaultTimeZone(TZConvert.GetTimeZoneInfo("Asia/Dhaka"))
                .SetDefaultLanguage("en_US")
                .SetSecurityRulesProvider(new FileBasedSecurityRulesProvider("config"))
                .RegisterController<Department, DepartmentController>()
                .RegisterController<ExampleClass, ExampleClassController>()
                );            

            services.AddRazorPages().AddRazorRuntimeCompilation();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
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