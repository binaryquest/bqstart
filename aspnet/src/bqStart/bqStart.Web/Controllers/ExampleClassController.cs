using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using bqStart.Data;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace bqStart.Web.Controllers
{
    public class ExampleClassController : GenericDataController<ExampleClass, int>
    {
        public ExampleClassController(IApplicationService applicationService, ILogger<ExampleClassController> logger, MainDataContext context) :
        base(applicationService, logger, new UnitOfWork<ApplicationUser>(context))
        {
            ExpandedTables = "Department";
            ExpandedTablesForSingleEntity = "Department";
        }

        protected override dynamic OnGetLookupData()
        {
            var deps = this.unitOfWork.GenericRepository<Department>().Get();

            var ret = new
            {
                departmentList = from d in deps
                             select new
                             {
                                 id = d.Id,
                                 name = d.DepartmentName
                             }
            };
            return ret;
        }
    }
}
