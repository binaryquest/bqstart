﻿using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using bqStart.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace bqStart.Web.Controllers
{
    public class IdentityRoleController : BaseRoleController
    {
        public IdentityRoleController(IApplicationService applicationService, RoleManager<IdentityRole> roleManager, ILogger<IdentityRoleController> logger, MainDataContext context) :
        base(applicationService, roleManager, logger, new UnitOfWork<ApplicationUser>(context))
        {

        }
    }
}
