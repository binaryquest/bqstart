using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    [IdentityDefaultUI(typeof(LogoutModel<>))]
    public abstract class LogoutModel : PageModel
    {
        public virtual void OnGet() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPost(string? returnUrl = null) => throw new NotImplementedException();
    }
    internal class LogoutModel<TUser> : LogoutModel where TUser : BaseUser
    {
        private readonly SignInManager<TUser> _signInManager;
        private readonly ILogger<LogoutModel<TUser>> _logger;

        public LogoutModel(SignInManager<TUser> signInManager, ILogger<LogoutModel<TUser>> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        public override void OnGet()
        {
        }

        public override async Task<IActionResult> OnPost(string? returnUrl = null)
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            if (returnUrl != null)
            {
                return LocalRedirect(returnUrl);
            }
            else
            {
                return RedirectToPage();
            }
        }
    }
}
