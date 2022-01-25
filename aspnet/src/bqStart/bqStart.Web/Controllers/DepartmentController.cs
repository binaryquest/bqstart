using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using bqStart.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace bqStart.Web.Controllers
{
    
    public class DepartmentController : GenericDataController<Department, int>
    {
        public DepartmentController(IApplicationService applicationService, ILogger<DepartmentController> logger, MainDataContext context) :
        base(applicationService, logger, new UnitOfWork<ApplicationUser>(context))
        {

        }

        protected override dynamic OnGetLookupData()
        {
            var ret = new
            {                
            };
            return ret;
        }
    }
}
