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
    [IdentityDefaultUI(typeof(ResetAuthenticatorModel<>))]
    public abstract class ResetAuthenticatorModel : PageModel
    {
        [TempData]
        public string? StatusMessage { get; set; }

        public virtual Task<IActionResult> OnGet() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync() => throw new NotImplementedException();
    }
    public class ResetAuthenticatorModel<TUser> : ResetAuthenticatorModel where TUser : BaseUser
    {
        readonly UserManager<TUser> _userManager;
        private readonly SignInManager<TUser> _signInManager;
        readonly ILogger<ResetAuthenticatorModel<TUser>> _logger;

        public ResetAuthenticatorModel(
            UserManager<TUser> userManager,
            SignInManager<TUser> signInManager,
            ILogger<ResetAuthenticatorModel<TUser>> logger)
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

            return Page();
        }

        public override async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            await _userManager.ResetAuthenticatorKeyAsync(user);
            _logger.LogInformation("User with ID '{UserId}' has reset their authentication app key.", user.Id);
            
            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Your authenticator app key has been reset, you will need to configure your authenticator app using the new key.";

            return RedirectToPage("./EnableAuthenticator");
        }
    }
}