using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using BinaryQuest.Framework.Core.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BinaryQuest.Framework.Core.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account.Manage
{
    [IdentityDefaultUI(typeof(IndexModel<>))]
    public abstract class IndexModel : PageModel
    {
        public string? Username { get; set; }

        public List<SelectListItem>? Options { get; set; }

        [TempData]
        public string? StatusMessage { get; set; }

        [BindProperty]
        public InputModel? Input { get; set; }

        public class InputModel
        {
            [Phone]
            [Display(Name = "Phone number")]
            public string? PhoneNumber { get; set; }

            [Display(Name = "First Name")]
            public string? FirstName { get; set; }

            [Display(Name = "Last Name")]
            public string? LastName { get; set; }

            [Display(Name = "Default Timezone")]
            public string? TimezoneId { get; set; }
        }

        public virtual Task<IActionResult> OnGetAsync() => throw new NotImplementedException();
        public virtual Task<IActionResult> OnPostAsync() => throw new NotImplementedException();
    }
    public partial class IndexModel<TUser> : IndexModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
        private readonly SignInManager<TUser> _signInManager;

        public IndexModel(
            UserManager<TUser> userManager,
            SignInManager<TUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        private async Task LoadAsync(TUser user)
        {
            var userName = await _userManager.GetUserNameAsync(user);
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);

            Username = userName;

            Input = new InputModel
            {
                PhoneNumber = phoneNumber,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TimezoneId = user.TimeZoneId
            };

            var tzs = TimeZoneInfo.GetSystemTimeZones();
            Options = (from s in tzs
                      orderby s.BaseUtcOffset
                      select new SelectListItem
                      {
                          Value = s.Id,
                          Text = s.DisplayName
                      }).ToList();
        }

        public override async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await LoadAsync(user);
            return Page();
        }

        public override async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (!ModelState.IsValid)
            {
                await LoadAsync(user);
                return Page();
            }

            user.FirstName = Input!.FirstName;
            user.LastName = Input.LastName;
            user.TimeZoneId = Input.TimezoneId;

            var updateResult = await _userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
            {

            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (Input.PhoneNumber != phoneNumber)
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    StatusMessage = "Unexpected error when trying to set phone number.";
                    return RedirectToPage();
                }
                }
            }
            else
            {
                StatusMessage = "Unexpected error when trying to update profile.";
                return RedirectToPage();
            }

            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Your profile has been updated";
            return RedirectToPage();
        }
    }
}
