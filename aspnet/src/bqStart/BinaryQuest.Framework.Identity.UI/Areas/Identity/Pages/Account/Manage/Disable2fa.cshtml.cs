﻿using System;
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
    [IdentityDefaultUI(typeof(Disable2faModel<>))]
    public abstract class Disable2faModel : PageModel
    {
        [TempData]
        public string? StatusMessage { get; set; }

        public virtual Task<IActionResult> OnGet() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync() => throw new NotImplementedException();
    }
    internal class Disable2faModel<TUser> : Disable2faModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
        private readonly ILogger<Disable2faModel<TUser>> _logger;

        public Disable2faModel(
            UserManager<TUser> userManager,
            ILogger<Disable2faModel<TUser>> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public override async Task<IActionResult> OnGet()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (!await _userManager.GetTwoFactorEnabledAsync(user))
            {
                throw new InvalidOperationException($"Cannot disable 2FA for user with ID '{_userManager.GetUserId(User)}' as it's not currently enabled.");
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

            var disable2faResult = await _userManager.SetTwoFactorEnabledAsync(user, false);
            if (!disable2faResult.Succeeded)
            {
                throw new InvalidOperationException($"Unexpected error occurred disabling 2FA for user with ID '{_userManager.GetUserId(User)}'.");
            }

            _logger.LogInformation("User with ID '{UserId}' has disabled 2fa.", _userManager.GetUserId(User));
            StatusMessage = "2fa has been disabled. You can reenable 2fa when you setup an authenticator app";
            return RedirectToPage("./TwoFactorAuthentication");
        }
    }
}