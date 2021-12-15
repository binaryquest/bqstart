using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using BinaryQuest.Framework.Core.Data;

namespace BinaryQuest.Framework.Identity.UI.Web.Areas.Identity.Pages.Account.Manage
{
    [IdentityDefaultUI(typeof(PersonalDataModel<>))]
    public abstract class PersonalDataModel : PageModel
    {
        public virtual Task<IActionResult> OnGet() => throw new NotImplementedException();
    }

    public class PersonalDataModel<TUser> : PersonalDataModel where TUser : BaseUser
    {
        private readonly UserManager<TUser> _userManager;
        private readonly ILogger<PersonalDataModel<TUser>> _logger;

        public PersonalDataModel(
            UserManager<TUser> userManager,
            ILogger<PersonalDataModel<TUser>> logger)
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

            return Page();
        }
    }
}