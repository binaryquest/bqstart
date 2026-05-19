using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using bqStart.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace bqStart.Web.Controllers
{
    // Not an API controller: OAuth authorize must redirect (302) to Identity login, not return 401.
    public class AuthorizationController : Controller
    {
        private static readonly HashSet<string> AllowedScopes = new(StringComparer.Ordinal)
        {
            Scopes.OpenId,
            Scopes.Profile,
            Scopes.OfflineAccess,
            "bqStart.WebAPI"
        };

        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;

        public AuthorizationController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [HttpGet("~/connect/authorize")]
        [HttpPost("~/connect/authorize")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Authorize()
        {
            var request = HttpContext.GetOpenIddictServerRequest();
            if (request == null)
            {
                throw new InvalidOperationException("The OpenID Connect request cannot be retrieved.");
            }

            var result = await HttpContext.AuthenticateAsync(IdentityConstants.ApplicationScheme);
            var requiresLogin = !result.Succeeded || HasPrompt(request, PromptValues.Login);
            if (requiresLogin)
            {
                if (HasPrompt(request, PromptValues.None))
                {
                    return Forbid(
                        new AuthenticationProperties(new Dictionary<string, string?>
                        {
                            [OpenIddictServerAspNetCoreConstants.Properties.Error] = Errors.LoginRequired,
                            [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The user is not logged in."
                        }),
                        OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                }

                var redirectUri = Request.PathBase + Request.Path + Request.QueryString;
                return Challenge(new AuthenticationProperties
                {
                    RedirectUri = redirectUri
                }, IdentityConstants.ApplicationScheme);
            }

            var user = await userManager.GetUserAsync(result.Principal!);
            if (user == null)
            {
                return Challenge(IdentityConstants.ApplicationScheme);
            }

            var principal = await signInManager.CreateUserPrincipalAsync(user);

            // Identity uses NameIdentifier; OpenIddict requires the standard "sub" claim.
            principal.SetClaim(Claims.Subject, await userManager.GetUserIdAsync(user));

            var userName = await userManager.GetUserNameAsync(user);
            if (!string.IsNullOrEmpty(userName))
            {
                principal.SetClaim(Claims.Name, userName);
            }

            principal.SetScopes(request.GetScopes().Where(AllowedScopes.Contains));
            principal.SetResources("bqStart.WebAPI");

            foreach (var claim in principal.Claims)
            {
                claim.SetDestinations(GetDestinations(claim));
            }

            return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        [HttpPost("~/connect/token")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Exchange()
        {
            var request = HttpContext.GetOpenIddictServerRequest();
            if (request == null)
            {
                throw new InvalidOperationException("The OpenID Connect request cannot be retrieved.");
            }

            if (request.IsClientCredentialsGrantType())
            {
                var identity = new ClaimsIdentity(
                    OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
                    Claims.Name,
                    Claims.Role);

                var clientId = request.ClientId ?? "service-client";
                identity.SetClaim(Claims.Subject, clientId);
                identity.SetClaim(Claims.Name, clientId);

                var principal = new ClaimsPrincipal(identity);
                principal.SetScopes(request.GetScopes().Where(AllowedScopes.Contains));
                principal.SetResources("bqStart.WebAPI");

                foreach (var claim in principal.Claims)
                {
                    claim.SetDestinations(GetDestinations(claim));
                }

                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }

            if (request.IsAuthorizationCodeGrantType() || request.IsRefreshTokenGrantType())
            {
                var authenticateResult = await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                if (!authenticateResult.Succeeded || authenticateResult.Principal == null)
                {
                    return Forbid(
                        new AuthenticationProperties(new Dictionary<string, string?>
                        {
                            [OpenIddictServerAspNetCoreConstants.Properties.Error] = Errors.InvalidGrant,
                            [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The authorization grant is no longer valid."
                        }),
                        OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                }

                var user = await userManager.GetUserAsync(authenticateResult.Principal);
                if (user == null)
                {
                    return Forbid(
                        new AuthenticationProperties(new Dictionary<string, string?>
                        {
                            [OpenIddictServerAspNetCoreConstants.Properties.Error] = Errors.InvalidGrant,
                            [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The associated user account no longer exists."
                        }),
                        OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                }

                var principal = authenticateResult.Principal;
                principal.SetScopes(principal.GetScopes().Where(AllowedScopes.Contains));
                principal.SetResources("bqStart.WebAPI");

                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }

            return BadRequest(new
            {
                error = Errors.UnsupportedGrantType,
                error_description = "The specified grant type is not supported by this server."
            });
        }

        [HttpGet("~/connect/logout")]
        [HttpPost("~/connect/logout")]
        [IgnoreAntiforgeryToken]
        public IActionResult Logout()
        {
            return SignOut(
                new AuthenticationProperties { RedirectUri = "/" },
                IdentityConstants.ApplicationScheme,
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        private static IEnumerable<string> GetDestinations(Claim claim)
        {
            return claim.Type switch
            {
                Claims.Name or Claims.Subject or Claims.Role or Claims.Email or
                Claims.GivenName or Claims.FamilyName or Claims.PreferredUsername =>
                [Destinations.AccessToken, Destinations.IdentityToken],
                _ =>
                [Destinations.AccessToken]
            };
        }

        private static bool HasPrompt(OpenIddictRequest request, string prompt)
        {
            return request.Prompt?.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Contains(prompt, StringComparer.Ordinal) == true;
        }
    }
}



