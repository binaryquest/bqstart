using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public abstract class BaseRoleController : DataController<IdentityRole, string>
    {
        protected readonly ILogger<BaseRoleController> logger;
        protected readonly RoleManager<IdentityRole> roleManager;

        public BaseRoleController(IApplicationService applicationService, RoleManager<IdentityRole> roleManager, ILogger<BaseRoleController> logger) :base(applicationService)
        {            
            this.roleManager = roleManager;
            this.logger = logger;
        }

        protected override Task<IQueryable<IdentityRole>> OnGetData()
        {
            var results = roleManager.Roles.ToList().AsQueryable();

            if (SecurityWhereClause != null)
            {
                results = results.Where(SecurityWhereClause);
            }

            return Task.FromResult(results);
        }

        protected override dynamic OnGetLookupStageData()
        {
            throw new NotImplementedException();
        }

        public override async Task<IdentityRole> OnGetSingleData(object[] keyValues)
        {
            await Task.Delay(10);
            var allRoles = roleManager.Roles;
            return allRoles.Where(x => keyValues.Contains(x.Id)).FirstOrDefault();
        }

        protected override async Task<IActionResult> OnInsert(IdentityRole entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (SecurityWhereClause != null)
                {
                    Func<IdentityRole, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }                

                OnBeforeCreate(entity);

                var exists = await roleManager.FindByNameAsync(entity.Name);
                if (exists != null)
                {
                    throw new Exception("Role already defined");
                }

                exists = await roleManager.FindByIdAsync(entity.Id);
                if (exists != null)
                {
                    throw new Exception("Role already defined");
                }

                IdentityResult result = await roleManager.CreateAsync(new IdentityRole(entity.Name));
                if (result.Succeeded)
                {
                    exists = await roleManager.FindByNameAsync(entity.Name);
                    logger.LogDebug("Created the role `{role}` successfully", entity.Name);
                    OnAfterCreate(exists);
                    return Created(exists);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"Role `{entity.Name}` cannot be created", innerException);
                    logger.LogError("Role `{role}` cannot be created", entity.Name);
                    throw exception;
                }                
            }            
            catch (Exception duexp)
            {
                string msg = $"Role Insert Error. {duexp.Message}";
                if (duexp.InnerException != null)
                {
                    if (duexp.InnerException.InnerException != null)
                    {
                        msg += duexp.InnerException.InnerException.Message;
                    }
                    else
                    {
                        msg += duexp.InnerException.Message;
                    }
                }
                logger.LogError("Error OnInsert {0}", msg);
                return UnprocessableEntity(msg);
            }
        }

        protected override async Task<IActionResult> OnUpdate(IdentityRole entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (entity.Name == this.applicationService.ConfigOptions.DefaultAdminRole)
                {
                    ApplicationException exception = new($"Default Role `{entity.Name}` cannot be updated");
                    logger.LogError("Default Role `{role}` cannot be updated", entity.Name);
                    throw exception;
                }

                if (SecurityWhereClause != null)
                {
                    Func<IdentityRole, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }

                OnBeforeEdit(entity);

                IdentityResult result = await roleManager.UpdateAsync(entity);

                if (result.Succeeded)
                {
                    logger.LogDebug("Updated the role `{role}` successfully", entity.Name);
                    OnAfterEdit(entity);
                    return Updated(entity);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"Role `{entity.Name}` cannot be updated", innerException);
                    logger.LogError("Role `{role}` cannot be updated", entity.Name);                    
                    throw exception;
                }
            }            
            catch (Exception duexp)
            {
                string msg = $"Role Update Error. {duexp.Message}";
                if (duexp.InnerException != null)
                {
                    if (duexp.InnerException.InnerException != null)
                    {
                        msg += duexp.InnerException.InnerException.Message;
                    }
                    else
                    {
                        msg += duexp.InnerException.Message;
                    }
                }
                logger.LogError("Error OnUpdate {0}", msg);
                return UnprocessableEntity(msg);
            }
        }

        protected override async Task<IActionResult> OnDelete(IdentityRole entity)
        {
            try
            {
                OnBeforeDelete(entity);

                if (entity.Name == this.applicationService.ConfigOptions.DefaultAdminRole)
                {
                    ApplicationException exception = new($"Default Role `{entity.Name}` cannot be deleted");
                    logger.LogError("Default Role `{role}` cannot be deleted", entity.Name);
                    throw exception;
                }

                IdentityResult result = await roleManager.DeleteAsync(entity);

                if (result.Succeeded)
                {
                    logger.LogDebug("Deleted the role `{role}` successfully", entity.Name);
                    OnAfterDelete(entity);
                    return Ok(entity);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"Role `{entity.Name}` cannot be deleted", innerException);
                    logger.LogError("Role `{role}` cannot be deleted", entity.Name);
                    throw exception;
                }
            }            
            catch (Exception duexp)
            {
                string msg = $"Role Delete Error. {duexp.Message}";
                if (duexp.InnerException != null)
                {
                    if (duexp.InnerException.InnerException != null)
                    {
                        msg += duexp.InnerException.InnerException.Message;
                    }
                    else
                    {
                        msg += duexp.InnerException.Message;
                    }
                }                
                logger.LogError("Error OnDelete {0}", msg);
                return UnprocessableEntity(msg);
            }
        }

        protected override ModelMetadata OnGetModelMetaData()
        {
            if (this.applicationService.Bootdata.MetaDataValues.ContainsKey(typeof(IdentityRole)))
            {
                var md = this.applicationService.Bootdata.MetaDataValues[typeof(IdentityRole)];
                md.AllowAdd = AllowInsert();
                md.AllowEdit = AllowUpdate();
                md.AllowSelect = AllowSelect();
                md.AllowDelete = AllowDelete();
                return md;
            }
            else
            {
                return new();
            }
        }

        [EnableQuery]
        [HttpGet()]
        public Task<IActionResult> Get([FromODataUri] string key)
        {
            return GetInternal(new object[] { key });
        }
    }
}
