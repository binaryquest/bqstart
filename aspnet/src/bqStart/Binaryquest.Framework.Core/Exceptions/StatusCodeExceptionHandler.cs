using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Exceptions
{
    public class StatusCodeExceptionHandler
    {
        private readonly RequestDelegate request;

        public StatusCodeExceptionHandler(RequestDelegate pipeline)
        {
            this.request = pipeline;
        }

        public Task Invoke(HttpContext context) => this.InvokeAsync(context); // Stops VS from nagging about async method without ...Async suffix.

        async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await this.request(context);
            }
            catch (StatusCodeException exception)
            {
                context.Response.StatusCode = (int)exception.StatusCode;
                context.Response.Headers.Clear();
            }
        }
    }
}
