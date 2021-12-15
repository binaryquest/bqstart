using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account.Manage
{
    [IdentityDefaultUI(typeof(TwoFactorAuthenticationModel<>))]
    public abstract class TwoFactorAuthenticationModel : PageModel
    {
        public bool HasAuthenticator { get; set; }

        public int RecoveryCodesLeft { get; set; }

        [BindProperty]
        public bool Is2faEnabled { get; set; }

        public bool IsMachineRemembered { get; set; }

        [TempData]
        public string? StatusMessage { get; set; }

        public virtual Task<IActionResult> OnGet() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPost() => throw new NotImplementedException();

    }
    public class TwoFactorAuthenticationModel<TUser> : TwoFactorAuthenticationModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
        private readonly SignInManager<TUser> _signInManager;
#pragma warning disable IDE0052 // Remove unread private members
        private readonly ILogger<TwoFactorAuthenticationModel<TUser>> _logger;
#pragma warning restore IDE0052 // Remove unread private members

        public TwoFactorAuthenticationModel(
            UserManager<TUser> userManager,
            SignInManager<TUser> signInManager,
            ILogger<TwoFactorAuthenticationModel<TUser>> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        public override async Task<IActionResult> OnGet()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            HasAuthenticator = await _userManager.GetAuthenticatorKeyAsync(user) != null;
            Is2faEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
            IsMachineRemembered = await _signInManager.IsTwoFactorClientRememberedAsync(user);
            RecoveryCodesLeft = await _userManager.CountRecoveryCodesAsync(user);

            return Page();
        }

        public override async Task<IActionResult> OnPost()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await _signInManager.ForgetTwoFactorClientAsync();
            StatusMessage = "The current browser has been forgotten. When you login again from this browser you will be prompted for your 2fa code.";
            return RedirectToPage();
        }
    }
}