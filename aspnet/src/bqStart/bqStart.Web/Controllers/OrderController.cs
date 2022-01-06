using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using bqStart.Data;
using Microsoft.Extensions.Logging;
namespace bqStart.Web.Controllers
{
    public class OrderController : GenericDataController<Order, int>
    {
        public OrderController(IApplicationService applicationService, ILogger<OrderController> logger, MainDataContext context) :
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
