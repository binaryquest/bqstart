﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    [IdentityDefaultUI(typeof(ResetPasswordModel<>))]
    public abstract class ResetPasswordModel : PageModel
    {
        [BindProperty]
        public InputModel? Input { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string? Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            public string? Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string? ConfirmPassword { get; set; }

            public string? Code { get; set; }
        }

        public virtual IActionResult OnGet(string? code = null) => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync() => throw new NotImplementedException();
    }
    public class ResetPasswordModel<TUser> : ResetPasswordModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;

        public ResetPasswordModel(UserManager<TUser> userManager)
        {
            _userManager = userManager;
        }

        public override IActionResult OnGet(string? code = null)
        {
            if (code == null)
            {
                return BadRequest("A code must be supplied for password reset.");
            }
            else
            {
                Input = new InputModel
                {
                    Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code))
                };
                return Page();
            }
        }

        public override async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userManager.FindByEmailAsync(Input!.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToPage("./ResetPasswordConfirmation");
            }

            var result = await _userManager.ResetPasswordAsync(user, Input.Code, Input.Password);
            if (result.Succeeded)
            {
                return RedirectToPage("./ResetPasswordConfirmation");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return Page();
        }
    }
}
