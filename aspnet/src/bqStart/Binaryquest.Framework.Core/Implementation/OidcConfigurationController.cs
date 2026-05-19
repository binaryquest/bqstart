using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BinaryQuest.Framework.Core.Implementation
{
    public class OidcConfigurationController : Controller
    {
        public OidcConfigurationController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [HttpGet("_configuration/{clientId}")]
        public IActionResult GetClientRequestParameters([FromRoute] string clientId)
        {
            var authority = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            var basePath = string.IsNullOrEmpty(Request.PathBase) ? string.Empty : Request.PathBase.ToString();
            var scope = Configuration[$"OpenIddict:Clients:{clientId}:Scope"] ?? "openid profile offline_access bqStart.WebAPI";
            var loginCallbackPath = Configuration[$"OpenIddict:Clients:{clientId}:LoginCallbackPath"] ?? "authentication/login-callback";
            var logoutCallbackPath = Configuration[$"OpenIddict:Clients:{clientId}:LogoutCallbackPath"] ?? "authentication/logout-callback";

            // Return typed JSON (not string dictionary) for oidc-client compatibility.
            // loadUserInfo must be false: OpenIddict does not expose a userinfo endpoint by default.
            return Ok(new
            {
                authority,
                client_id = clientId,
                redirect_uri = $"{authority}/{loginCallbackPath.TrimStart('/')}",
                post_logout_redirect_uri = $"{authority}/{logoutCallbackPath.TrimStart('/')}",
                response_type = "code",
                scope,
                automaticSilentRenew = true,
                includeIdTokenInSilentRenew = true,
                loadUserInfo = false,
                metadataUrl = $"{authority}{basePath}/.well-known/openid-configuration"
            });
        }
    }
}
