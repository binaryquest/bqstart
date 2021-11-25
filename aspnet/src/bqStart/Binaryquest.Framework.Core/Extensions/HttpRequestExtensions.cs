using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Extensions
{
    public static class HttpRequestExtensions
    {
        public static IActionResult CreateResponse<TEntity>(this HttpRequest request, HttpStatusCode status, TEntity content = default)
        {
            return new ObjectResult(content)
            {
                StatusCode = (int?)status
            };
        }

        public static IActionResult CreateResponse(this HttpRequest request, HttpStatusCode status)
        {
            return new ObjectResult(null)
            {
                StatusCode = (int?)status
            };
        }
    }
}
