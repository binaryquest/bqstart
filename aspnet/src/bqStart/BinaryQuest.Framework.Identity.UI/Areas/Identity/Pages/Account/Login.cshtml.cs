using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Interface;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    [IdentityDefaultUI(typeof(LoginModel<>))]
    public abstract class LoginModel : PageModel
    {
        [BindProperty]
        public InputModel? Input { get; set; }

        public IList<AuthenticationScheme>? ExternalLogins { get; set; }

        public string? ReturnUrl { get; set; }

        [TempData]
        public string? ErrorMessage { get; set; }
        public bool AllowRegistration { get; protected set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string? Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string? Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        public virtual Task OnGetAsync(string? returnUrl = null) => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync(string? returnUrl = null) => throw new NotImplementedException();
    }
    internal class LoginModel<TUser> : LoginModel where TUser :BaseUser
    {
#pragma warning disable IDE0052 // Remove unread private members
        private readonly UserManager<TUser> _userManager;
#pragma warning restore IDE0052 // Remove unread private members
        private readonly IApplicationService applicationService;
        private readonly SignInManager<TUser> _signInManager;
        private readonly ILogger<LoginModel<TUser>> _logger;

        public LoginModel(SignInManager<TUser> signInManager,
            ILogger<LoginModel<TUser>> logger,
            UserManager<TUser> userManager, IApplicationService applicationService)
        {
            _userManager = userManager;
            this.applicationService = applicationService;
            _signInManager = signInManager;
            _logger = logger;
            AllowRegistration = applicationService.ConfigOptions.AllowUserRegistration;
        }

        public override async Task OnGetAsync(string? returnUrl = null)
        {
            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }

            returnUrl ??= Url.Content("~/");

            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            ReturnUrl = returnUrl;
        }

        public override async Task<IActionResult> OnPostAsync(string? returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(Input!.Email, Input.Password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");
                    return LocalRedirect(returnUrl);
                }
                if (result.RequiresTwoFactor)
                {
                    return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, Input.RememberMe });
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return RedirectToPage("./Lockout");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return Page();
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}
