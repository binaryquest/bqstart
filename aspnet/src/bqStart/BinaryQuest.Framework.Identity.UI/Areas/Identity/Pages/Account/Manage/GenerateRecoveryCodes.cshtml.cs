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
    [IdentityDefaultUI(typeof(GenerateRecoveryCodesModel<>))]
    public abstract class GenerateRecoveryCodesModel : PageModel
    {
        [TempData]
        public string[]? RecoveryCodes { get; set; }

        [TempData]
        public string? StatusMessage { get; set; }

        public virtual Task<IActionResult> OnGetAsync() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync() => throw new NotImplementedException();
    }
    public class GenerateRecoveryCodesModel<TUser> : GenerateRecoveryCodesModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
        private readonly ILogger<GenerateRecoveryCodesModel<TUser>> _logger;

        public GenerateRecoveryCodesModel(
            UserManager<TUser> userManager,
            ILogger<GenerateRecoveryCodesModel<TUser>> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public override async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var isTwoFactorEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
            if (!isTwoFactorEnabled)
            {
                var userId = await _userManager.GetUserIdAsync(user);
                throw new InvalidOperationException($"Cannot generate recovery codes for user with ID '{userId}' because they do not have 2FA enabled.");
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

            var isTwoFactorEnabled = await _userManager.GetTwoFactorEnabledAsync(user);
            var userId = await _userManager.GetUserIdAsync(user);
            if (!isTwoFactorEnabled)
            {
                throw new InvalidOperationException($"Cannot generate recovery codes for user with ID '{userId}' as they do not have 2FA enabled.");
            }

            var recoveryCodes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10);
            RecoveryCodes = recoveryCodes.ToArray();

            _logger.LogInformation("User with ID '{UserId}' has generated new 2FA recovery codes.", userId);
            StatusMessage = "You have generated new recovery codes.";
            return RedirectToPage("./ShowRecoveryCodes");
        }
    }
}