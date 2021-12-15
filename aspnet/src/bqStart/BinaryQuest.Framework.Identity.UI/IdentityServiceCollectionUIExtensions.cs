using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using BinaryQuest.Framework.Identity.UI;

namespace BinaryQuest.Framework.Identity
{
    public static class IdentityServiceCollectionUIExtensions
    {
        /// <summary>
        /// Adds a set of common identity services to the application, including a default UI, token providers,
        /// and configures authentication to use identity cookies.
        /// </summary>
        /// <remarks>
        /// In order to use the default UI, the application must be using <see cref="Microsoft.AspNetCore.Mvc"/>,
        /// <see cref="Microsoft.AspNetCore.StaticFiles"/> and contain a <c>_LoginPartial</c> partial view that
        /// can be found by the application.
        /// </remarks>
        /// <param name="services">The <see cref="IServiceCollection"/>.</param>
        /// <returns>The <see cref="IdentityBuilder"/>.</returns>
        public static IdentityBuilder AddDefaultIdentityWithBQUI<TUser>(this IServiceCollection services) where TUser : class
            => services.AddDefaultIdentity<TUser>(_ => { });

        /// <summary>
        /// Adds a set of common identity services to the application, including a default UI, token providers,
        /// and configures authentication to use identity cookies.
        /// </summary>
        /// <remarks>
        /// In order to use the default UI, the application must be using <see cref="Microsoft.AspNetCore.Mvc"/>,
        /// <see cref="Microsoft.AspNetCore.StaticFiles"/> and contain a <c>_LoginPartial</c> partial view that
        /// can be found by the application.
        /// </remarks>
        /// <param name="services">The <see cref="IServiceCollection"/>.</param>
        /// <param name="configureOptions">Configures the <see cref="IdentityOptions"/>.</param>
        /// <returns>The <see cref="IdentityBuilder"/>.</returns>
        public static IdentityBuilder AddDefaultIdentityWithBQUI<TUser>(this IServiceCollection services, Action<IdentityOptions> configureOptions) where TUser : class
        {
            services.AddAuthentication(o =>
            {
                o.DefaultScheme = IdentityConstants.ApplicationScheme;
                o.DefaultSignInScheme = IdentityConstants.ExternalScheme;
            })
            .AddIdentityCookies(o => { });

            var builder = services.AddIdentityCore<TUser>(o =>
            {
                o.Stores.MaxLengthForKeys = 128;
                configureOptions?.Invoke(o);
            });


            builder.AddSignInManager();
            builder.Services.AddMvc();

            builder.Services.ConfigureOptions(
                typeof(IdentityDefaultUIConfigureOptions<>)
                    .MakeGenericType(builder.UserType));
            builder.AddDefaultTokenProviders();

            return builder;
        }
    }
}
