using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface IBQBuilder
    {        
        IApplicationBuilder Builder { get; }
        IBQBuilder UseCustomEndpoints(Action<IEndpointRouteBuilder> endpoints);        
        IBQBuilder Build();
    }
}
