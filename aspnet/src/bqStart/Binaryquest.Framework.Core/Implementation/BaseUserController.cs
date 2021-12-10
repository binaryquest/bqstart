using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public abstract class BaseUserController<TUser, TKey> : DataController<TUser, TKey> where TUser : BaseUser
    {
        protected readonly ILogger<BaseUserController<TUser, TKey>> logger;
        protected readonly RoleManager<IdentityRole> roleManager;
        protected readonly UserManager<TUser> userManager;
        protected readonly IUnitOfWork unitOfWork;

        public BaseUserController(IApplicationService applicationService,
            [NotNull] UserManager<TUser> userManager,
            [NotNull] RoleManager<IdentityRole> roleManager,
            [NotNull] ILogger<BaseUserController<TUser, TKey>> logger,
            [NotNull] IUnitOfWork unitOfWork) : base(applicationService)
        {            
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public override async Task<TUser> OnGetSingleData(object[] keyValues)
        {
            var all = userManager.Users;
            var entity =  all.Where(x => keyValues.Contains(x.Id)).FirstOrDefault();
            if (entity != null)
            {
                entity.Password = string.Empty;
                entity.VerifyPassword = String.Empty;

                var roles = await userManager.GetRolesAsync(entity);
                entity.AssignedRoles = roles.ToList();
            }
            return entity;
        }

        protected override async Task<IActionResult> OnDelete(TUser entity)
        {
            try
            {
                OnBeforeDelete(entity);
                
                IdentityResult result = await userManager.DeleteAsync(entity);

                if (result.Succeeded)
                {
                    logger.LogDebug("Deleted the user `{Id}` successfully", entity.Id);
                    OnAfterDelete(entity);
                    return Ok(entity);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"User `{entity.Id}` cannot be deleted", innerException);
                    logger.LogError("User `{Id}` cannot be deleted", entity.Id);
                    throw exception;
                }
            }
            catch (Exception duexp)
            {
                string msg = $"User Delete Error. {duexp.Message}";
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

        [EnableQuery]
        [HttpGet()]
        public override async Task<IActionResult> Get()
        {
            if (!AllowSelect())
            {
                return Unauthorized();
            }

            var results = userManager.Users.ToList().AsQueryable();

            if (SecurityWhereClause != null)
            {
                results = results.Where(SecurityWhereClause);
            }

            foreach (var item in results)
            {
                var roles = await userManager.GetRolesAsync(item);
                item.AssignedRoles = roles.ToList();
            }

            return Ok(results);
        }

        protected override Task<IQueryable<TUser>> OnGetData()
        {
            throw new NotImplementedException();
        }

        protected override dynamic OnGetLookupStageData()
        {
            throw new NotImplementedException();
        }

        protected override ModelMetadata OnGetModelMetaData()
        {
            if (this.applicationService.Bootdata.MetaDataValues.ContainsKey(typeof(TUser)))
            {
                var md = this.applicationService.Bootdata.MetaDataValues[typeof(TUser)];
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

        protected async override Task<IActionResult> OnInsert(TUser entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (string.IsNullOrEmpty(entity?.Email))
                {
                    return BadRequest();
                }

                if (SecurityWhereClause != null)
                {
                    Func<TUser, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }

                var exists = await userManager.FindByEmailAsync(entity.Email);
                if (exists != null)
                {
                    throw new Exception("User Email already exists");
                }

                if (entity.Password != null)
                {
                    if (entity.Password != entity.VerifyPassword)
                    {
                        throw new Exception("Password and Verify Password do not match");
                    }
                }

                entity.UserName = entity.Email;

                OnBeforeCreate(entity);                

                IdentityResult result = await userManager.CreateAsync(entity, entity.Password);

                if (result.Succeeded)
                {
                    exists = await userManager.FindByEmailAsync(entity.Email);

                    if (entity.AssignedRoles != null)
                    {
                        string[] roles = entity.AssignedRoles.ToArray();
                        result = await userManager.AddToRolesAsync(entity, roles);
                    }

                    if (!result.Succeeded)
                    {
                        var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                        Exception innerException = new(innerMsg);
                        ApplicationException exception = new($"Added user `{entity.Email}` but can not assign to selected roles.", innerException);
                        logger.LogError("Added user `{Email}` but can not assign to roles", entity.Email);
                        throw exception;
                    }

                    logger.LogDebug("Created the user `{Id}` successfully", entity.Id);
                    OnAfterCreate(exists);
                    return Created(exists);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"User `{entity.Email}` cannot be created", innerException);
                    logger.LogError("User `{Email}` cannot be created", entity.Email);
                    throw exception;
                }
            }
            catch (Exception duexp)
            {
                string msg = $"User Insert Error. {duexp.Message}";
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

        protected async override Task<IActionResult> OnUpdate(TUser entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (string.IsNullOrEmpty(entity?.Email))
                {
                    return BadRequest();
                }

                if (SecurityWhereClause != null)
                {
                    Func<TUser, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }

                if (!string.IsNullOrEmpty(entity.Password))
                {
                    if (entity.Password != entity.VerifyPassword)
                    {
                        throw new Exception("Password and Verify Password do not match");
                    }
                }

                entity.UserName = entity.Email;

                this.unitOfWork.GenericRepository<TUser>().Attach(entity);

                OnBeforeEdit(entity);

                IdentityResult result = await userManager.UpdateAsync(entity);                

                if (result.Succeeded)
                {
                    var currentRoles = await userManager.GetRolesAsync(entity);
                    await userManager.RemoveFromRolesAsync(entity, currentRoles);

                    if (entity.AssignedRoles != null)
                    {
                        string[] roles = entity.AssignedRoles.ToArray();
                        result = await userManager.AddToRolesAsync(entity, roles);
                    }

                    if (!result.Succeeded)
                    {
                        var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                        Exception innerException = new(innerMsg);
                        ApplicationException exception = new($"Updated user `{entity.Email}` but can not assign to selected roles.", innerException);
                        logger.LogError("Updated user `{Email}` but can not assign to roles", entity.Email);
                        throw exception;
                    }

                    if (!string.IsNullOrEmpty(entity.Password))
                    {
                        var token = await userManager.GeneratePasswordResetTokenAsync(entity);
                        result = await userManager.ResetPasswordAsync(entity, token, entity.Password);

                        if (!result.Succeeded)
                        {
                            var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                            Exception innerException = new(innerMsg);
                            ApplicationException exception = new($"User Password `{entity.UserName}` cannot be updated", innerException);
                            logger.LogError("User Password `{Id}` cannot be updated", entity.Id);
                            throw exception;
                        }
                    }

                    await this.unitOfWork.SaveAsync();

                    logger.LogDebug("Updated the user `{Id}` successfully", entity.Id);
                    OnAfterEdit(entity);
                    return Updated(entity);
                }
                else
                {
                    var innerMsg = string.Join(';', result.Errors.Select(x => x.Description).ToList());
                    Exception innerException = new(innerMsg);
                    ApplicationException exception = new($"User `{entity.Id}` cannot be updated", innerException);
                    logger.LogError("User `{Id}` cannot be updated", entity.Id);
                    throw exception;
                }
            }
            catch (Exception duexp)
            {
                string msg = $"User Update Error. {duexp.Message}";
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

        [EnableQuery]
        [HttpGet()]
        public Task<IActionResult> Get([FromODataUri] TKey key)
        {
            return GetInternal(new object[] { key });
        }        

        protected override dynamic OnGetLookupData()
        {
            var tzs = TimeZoneInfo.GetSystemTimeZones();
            var roles = roleManager.Roles.OrderBy(r => r.Name).Select(r => new { r.Name }).ToList();

            return new
            {
                TimeZones = from s in tzs
                            orderby s.BaseUtcOffset
                            select new
                            {
                                Id = s.Id,
                                Name = s.DisplayName
                            },
                Roles = roles
            };
        }
    }
}
