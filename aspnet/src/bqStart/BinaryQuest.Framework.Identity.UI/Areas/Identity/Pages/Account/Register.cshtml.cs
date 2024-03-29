﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using BinaryQuest.Framework.Core.Interface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    [IdentityDefaultUI(typeof(RegisterModel<>))]
    public abstract class RegisterModel : PageModel
    {
        [BindProperty]
        public InputModel? Input { get; set; }

        public string? ReturnUrl { get; set; }

        public IList<AuthenticationScheme>? ExternalLogins { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "Email")]
            public string? Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            [Display(Name = "Password")]
            public string? Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string? ConfirmPassword { get; set; }
        }

        public virtual Task<IActionResult> OnGetAsync(string? returnUrl = null) => throw new NotImplementedException();

        public virtual Task<IActionResult> OnPostAsync(string? returnUrl = null) => throw new NotImplementedException();

    }
    internal class RegisterModel<TUser> : RegisterModel where TUser : BaseUser,new()
    {
        private readonly SignInManager<TUser> _signInManager;
        private readonly UserManager<TUser> _userManager;
        private readonly ILogger<RegisterModel<TUser>> _logger;
        private readonly IEmailSender _emailSender;
        private readonly IApplicationService applicationService;

        public RegisterModel(
            UserManager<TUser> userManager,
            SignInManager<TUser> signInManager,
            ILogger<RegisterModel<TUser>> logger,
            IEmailSender emailSender,
            IApplicationService applicationService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _emailSender = emailSender;
            this.applicationService = applicationService;
        }
        
        public override async Task<IActionResult> OnGetAsync(string? returnUrl = null)
        {
            await Task.Delay(100);
            //check if registration is allowed globally in the app config
            if (!applicationService.ConfigOptions.AllowUserRegistration)
            {
                return RedirectToPage("Login");
            }
            ReturnUrl = returnUrl;
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            return Page();
        }

        public override async Task<IActionResult> OnPostAsync(string? returnUrl = null)
        {
            //check if registration is allowed globally in the app config
            if (!applicationService.ConfigOptions.AllowUserRegistration)
            {
                return RedirectToPage("Login");
            }

            returnUrl ??= Url.Content("~/");
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                var user = new TUser { UserName = Input!.Email, Email = Input.Email };
                var result = await _userManager.CreateAsync(user, Input.Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail",
                        pageHandler: null,
                        values: new { area = "Identity", userId = user.Id, code, returnUrl },
                        protocol: Request.Scheme);

                    await _emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl!)}'>clicking here</a>.");

                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        return RedirectToPage("RegisterConfirmation", new { email = Input.Email, returnUrl });
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return Page();
        }
    }
}
