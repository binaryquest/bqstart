using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Implementation;
using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.OData;
using System.Text.Json;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Serialization;
using BinaryQuest.Framework.Core.OData;
using Newtonsoft.Json.Converters;
using System.Globalization;

namespace BinaryQuest.Framework.Core.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddBqAdminServices<TUser, TDb>(this IServiceCollection services, Action<AppConfigOptions> options)
            where TDb : BQDataContext<TUser>
        where TUser : BaseUser
        {
            var opt = AppConfigOptions.Default;
            options?.Invoke(opt);
            var appSvc = new ApplicationService(opt, typeof(TUser), typeof(TDb));
            services.AddSingleton<IApplicationService>(appSvc);
            services.AddSingleton<ICacheManager>(appSvc);
            services.AddScoped<IUserService<TUser, TDb>, UserService<TUser, TDb>>();
            services.AddSingleton(opt.SecurityRulesProvider);

            services.AddControllersWithViews()
                .AddNewtonsoftJson(json =>
                {
                    json.SerializerSettings.MaxDepth = 32;
                    //json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
                    json.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                })
                //.AddJsonOptions(options =>
                //{
                //    //options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                //    options.JsonSerializerOptions.MaxDepth = 32;
                //    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                //})
                .AddOData(oData =>
                {
                    
                    oData.AddRouteComponents("odata", opt.GetEdmModel<TDb>(services, appSvc));
                    oData.EnableAttributeRouting = true;
                    oData.OrderBy().Filter().Select().Expand().Count().SetMaxTop(null);
                    oData.Conventions.Add(new BQEntityRoutingConvention());
                });


            return services;
        }


        //private static Type FindGenericBaseType(Type currentType, Type genericBaseType)
        //{
        //    var type = currentType;
        //    while (type != null)
        //    {
        //        var genericType = type.IsGenericType ? type.GetGenericTypeDefinition() : null;
        //        if (genericType != null && genericType == genericBaseType)
        //        {
        //            return type;
        //        }
        //        type = type.BaseType;
        //    }
        //    return null;
        //}
    }
}
