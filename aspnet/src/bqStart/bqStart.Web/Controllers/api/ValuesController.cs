using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace bqStart.Web.Controllers.api
{
    //[Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        [Route("/api/Values/ListProducts")]
        public ActionResult<string> ListProducts()
        {
            return  "OK";
        }
    }
}
