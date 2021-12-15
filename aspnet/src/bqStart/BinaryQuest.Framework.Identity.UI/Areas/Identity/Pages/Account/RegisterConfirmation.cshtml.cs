using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    [IdentityDefaultUI(typeof(RegisterConfirmationModel<>))]
    public abstract class RegisterConfirmationModel : PageModel
    {
        public string? Email { get; set; }

        public bool DisplayConfirmAccountLink { get; set; }

        public string? EmailConfirmationUrl { get; set; }

        public virtual Task<IActionResult> OnGetAsync(string email) => throw new NotImplementedException();
    }
    internal class RegisterConfirmationModel<TUser> : RegisterConfirmationModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
#pragma warning disable IDE0052 // Remove unread private members
        private readonly IEmailSender _sender;
#pragma warning restore IDE0052 // Remove unread private members

        public RegisterConfirmationModel(UserManager<TUser> userManager, IEmailSender sender)
        {
            _userManager = userManager;
            _sender = sender;
        }

        

        public override async Task<IActionResult> OnGetAsync(string email)
        {
            if (email == null)
            {
                return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"Unable to load user with email '{email}'.");
            }

            Email = email;            

            return Page();
        }
    }
}
