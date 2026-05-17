using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace bqStart.Web.Services
{
    public class OpenIddictSeeder : IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<OpenIddictSeeder> logger;

        public OpenIddictSeeder(IServiceProvider serviceProvider, ILogger<OpenIddictSeeder> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var applicationManager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();
            var scopeManager = scope.ServiceProvider.GetRequiredService<IOpenIddictScopeManager>();

            await EnsureScopeAsync(scopeManager, cancellationToken);
            await EnsureSpaClientAsync(applicationManager, cancellationToken);
            await EnsureElectronClientAsync(applicationManager, cancellationToken);
            await EnsureServiceClientAsync(applicationManager, cancellationToken);
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        private static async Task EnsureScopeAsync(IOpenIddictScopeManager scopeManager, CancellationToken cancellationToken)
        {
            if (await scopeManager.FindByNameAsync("bqStart.WebAPI", cancellationToken) != null)
            {
                return;
            }

            await scopeManager.CreateAsync(new OpenIddictScopeDescriptor
            {
                Name = "bqStart.WebAPI",
                DisplayName = "bqStart Web API",
                Resources = { "bqStart.WebAPI" }
            }, cancellationToken);
        }

        private async Task EnsureSpaClientAsync(IOpenIddictApplicationManager manager, CancellationToken cancellationToken)
        {
            if (await manager.FindByClientIdAsync("Default", cancellationToken) != null)
            {
                return;
            }

            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = "Default",
                ConsentType = ConsentTypes.Implicit,
                DisplayName = "bqStart SPA"
            };

            descriptor.Permissions.UnionWith(new[]
            {
                Permissions.Endpoints.Authorization,
                Permissions.Endpoints.Token,
                Permissions.Endpoints.EndSession,
                Permissions.GrantTypes.AuthorizationCode,
                Permissions.GrantTypes.RefreshToken,
                Permissions.ResponseTypes.Code,
                Permissions.Prefixes.Scope + Scopes.OpenId,
                Permissions.Prefixes.Scope + Scopes.Profile,
                Permissions.Prefixes.Scope + Scopes.OfflineAccess,
                Permissions.Prefixes.Scope + "bqStart.WebAPI"
            });

            descriptor.Requirements.Add(Requirements.Features.ProofKeyForCodeExchange);

            descriptor.RedirectUris.UnionWith(new[]
            {
                new Uri("https://localhost:5001/authentication/login-callback"),
                new Uri("http://localhost:5000/authentication/login-callback")
            });

            descriptor.PostLogoutRedirectUris.UnionWith(new[]
            {
                new Uri("https://localhost:5001/authentication/logout-callback"),
                new Uri("http://localhost:5000/authentication/logout-callback")
            });

            await manager.CreateAsync(descriptor, cancellationToken);
            logger.LogInformation("Seeded OpenIddict client '{ClientId}'.", descriptor.ClientId);
        }

        private async Task EnsureElectronClientAsync(IOpenIddictApplicationManager manager, CancellationToken cancellationToken)
        {
            if (await manager.FindByClientIdAsync("electronapp", cancellationToken) != null)
            {
                return;
            }

            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = "electronapp",
                ConsentType = ConsentTypes.Implicit,
                DisplayName = "bqStart Electron"
            };

            descriptor.Permissions.UnionWith(new[]
            {
                Permissions.Endpoints.Authorization,
                Permissions.Endpoints.Token,
                Permissions.Endpoints.EndSession,
                Permissions.GrantTypes.AuthorizationCode,
                Permissions.GrantTypes.RefreshToken,
                Permissions.ResponseTypes.Code,
                Permissions.Prefixes.Scope + Scopes.OpenId,
                Permissions.Prefixes.Scope + Scopes.Profile,
                Permissions.Prefixes.Scope + Scopes.OfflineAccess,
                Permissions.Prefixes.Scope + "bqStart.WebAPI"
            });

            descriptor.Requirements.Add(Requirements.Features.ProofKeyForCodeExchange);

            descriptor.RedirectUris.UnionWith(new[]
            {
                new Uri("app://localhost/authentication/login-callback"),
                new Uri("https://oauth.pstmn.io/v1/callback")
            });

            descriptor.PostLogoutRedirectUris.Add(new Uri("app://localhost/authentication/logout-callback"));

            await manager.CreateAsync(descriptor, cancellationToken);
            logger.LogInformation("Seeded OpenIddict client '{ClientId}'.", descriptor.ClientId);
        }

        private async Task EnsureServiceClientAsync(IOpenIddictApplicationManager manager, CancellationToken cancellationToken)
        {
            if (await manager.FindByClientIdAsync("cmsclient", cancellationToken) != null)
            {
                return;
            }

            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = "cmsclient",
                ClientSecret = "secret",
                ConsentType = ConsentTypes.Explicit,
                DisplayName = "CMS client"
            };

            descriptor.Permissions.UnionWith(new[]
            {
                Permissions.Endpoints.Token,
                Permissions.GrantTypes.ClientCredentials,
                Permissions.Prefixes.Scope + "bqStart.WebAPI"
            });

            await manager.CreateAsync(descriptor, cancellationToken);
            logger.LogInformation("Seeded OpenIddict client '{ClientId}'.", descriptor.ClientId);
        }
    }
}


