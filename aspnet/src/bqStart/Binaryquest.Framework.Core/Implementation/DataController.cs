﻿using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using IdentityModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public abstract class DataController<TEntity, TKey> : ODataController, IDataController<TEntity, TKey> where TEntity : class
    {
        protected readonly IApplicationService applicationService;
#pragma warning disable IDE0044 // Add readonly modifier
        private Expression<Func<TEntity, bool>>? securityWhereClause = null;
#pragma warning restore IDE0044 // Add readonly modifier


        public DataController(IApplicationService applicationService)
        {
            this.applicationService = applicationService;
        }

        public virtual Expression<Func<TEntity, bool>>? SecurityWhereClause
        {
            get { return securityWhereClause; }
        }

        public string ExpandedTables { get; protected set; } = String.Empty;
        public string ExpandedTablesForSingleEntity { get; protected set; } = String.Empty;

        #region REST Functions
        [EnableQuery]
        [HttpGet()]
        public virtual async Task<IActionResult> Get()
        {
            if (!AllowSelect())
            {
                
                return Unauthorized();
            }

            IQueryable results = await OnGetData();

            return Ok(results);
        }

        protected virtual async Task<IActionResult> GetInternal(object[] keyValues)
        {
            if (!AllowSelect())
            {
                return Unauthorized();
            }

            var result = await OnGetSingleData(keyValues);

            return Ok(result);
        }

        [HttpPost()]
        //[Route("Default.LookupData")]
        [CustomAction]
        public IActionResult LookupData()
        {
            if (!AllowSelect())
            {
                return Unauthorized();
            }

            var result = OnGetLookupData();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]TEntity entity)
        {
            if (!AllowUpdate())
            {
                return Unauthorized();
            }

            return await OnUpdate(entity);
        }

        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] TEntity entity)
        {
            if (!AllowInsert())
            {
                return Unauthorized();
            }


            return await OnInsert(entity);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(TKey key)
        {
            if (!AllowDelete())
            {
                return Unauthorized();
            }

            if (key == null)
            {
                return NotFound();
            }

            TEntity? entity = await OnGetSingleData(new object[] { key! });
            return await OnDelete(entity);            
        }

        [HttpPost()]
        [CustomAction]
        public IActionResult ModelMetaData()
        {            
            if (!IsAuthorized())
                return Unauthorized();

            var result = OnGetModelMetaData();
            return Ok(result);
            //return new JsonResult(result, new JsonSerializerSettings() {  });
        }        
        #endregion

        #region Abstract and Virtual Functions
        protected virtual void OnBeforeCreate(TEntity entity)
        {

        }

        protected virtual void OnAfterCreate(TEntity entity)
        {

        }

        protected virtual void OnBeforeEdit(TEntity entity)
        {

        }

        protected virtual void OnBeforeDelete(TEntity entity)
        {

        }

        protected virtual void OnAfterEdit(TEntity entity)
        {

        }

        protected virtual void OnAfterDelete(TEntity entity)
        {

        }

        protected virtual bool OnValidate(TEntity entity)
        {
            return true;
        }

        protected virtual dynamic OnGetLookupData()
        {
            return new { };
        }

        protected abstract ModelMetadata? OnGetModelMetaData();

        protected abstract dynamic OnGetLookupStageData();

        public abstract Task<TEntity?> OnGetSingleData(object[] keyValues);

        protected virtual TEntity OnUpdateStage(TKey key, string newId)
        {
            throw new NotImplementedException();
        }

        protected abstract Task<IQueryable<TEntity>> OnGetData();

        protected abstract Task<IActionResult> OnInsert(TEntity? entity);

        protected abstract Task<IActionResult> OnUpdate(TEntity? entity);

        protected abstract Task<IActionResult> OnDelete(TEntity? entity);
        #endregion

        public UserClaimInfo CurrentUser
        {
            get
            {
                UserClaimInfo info = new(User.FindFirstValue(ClaimTypes.Name),
                    User.FindFirstValue(ClaimTypes.GivenName),
                    User.FindFirstValue(ClaimTypes.Surname),
                    User.FindFirstValue(JwtClaimTypes.Locale),
                    User.FindFirstValue("timezone"));
                return info;
            }
        }

        #region Permissions Related
        protected bool IsAuthorized()
        {
            return User.Identity?.IsAuthenticated == true;
        }

        protected bool AllowSelect()
        {
            bool allow = false;
            var typeName = typeof(TEntity).Name;
            if (applicationService.Bootdata.SecurityRulesDictionary.ContainsKey(typeName))
            {
                var modelSecurityRuleDictionary = applicationService.Bootdata.SecurityRulesDictionary[typeName];
                var roleKeys = modelSecurityRuleDictionary.Keys.ToArray();
                var matchedRoleKeys = roleKeys.Where(r => IsInRole(r) || r == "everyone");


                if (matchedRoleKeys != null)
                {
                    foreach (var roleKey in matchedRoleKeys)
                    {
                        var rule = modelSecurityRuleDictionary[roleKey];
                        if (rule.AllowSelect)
                        {
                            allow = true;
                        }
                    }
                }
            }
            return allow;
        }

        protected bool AllowInsert()
        {
            bool allow = false;
            var typeName = typeof(TEntity).Name;
            if (applicationService.Bootdata.SecurityRulesDictionary.ContainsKey(typeName))
            {
                var modelSecurityRuleDictionary = applicationService.Bootdata.SecurityRulesDictionary[typeName];
                var roleKeys = modelSecurityRuleDictionary.Keys.ToArray();
                var matchedRoleKeys = roleKeys.Where(r => IsInRole(r) || r == "everyone");


                if (matchedRoleKeys != null)
                {
                    foreach (var roleKey in matchedRoleKeys)
                    {
                        var rule = modelSecurityRuleDictionary[roleKey];
                        if (rule.AllowInsert)
                        {
                            allow = true;
                        }
                    }
                }
            }
            return allow;
        }

        protected bool AllowUpdate()
        {
            bool allow = false;
            var typeName = typeof(TEntity).Name;
            if (applicationService.Bootdata.SecurityRulesDictionary.ContainsKey(typeName))
            {
                var modelSecurityRuleDictionary = applicationService.Bootdata.SecurityRulesDictionary[typeName];
                var roleKeys = modelSecurityRuleDictionary.Keys.ToArray();
                var matchedRoleKeys = roleKeys.Where(r => IsInRole(r) || r == "everyone");


                if (matchedRoleKeys != null)
                {
                    foreach (var roleKey in matchedRoleKeys)
                    {
                        var rule = modelSecurityRuleDictionary[roleKey];
                        if (rule.AllowUpdate)
                        {
                            allow = true;
                        }
                    }
                }
            }
            return allow;
        }

        protected bool AllowDelete()
        {
            bool allow = false;
            var typeName = typeof(TEntity).Name;
            if (applicationService.Bootdata.SecurityRulesDictionary.ContainsKey(typeName))
            {
                var modelSecurityRuleDictionary = applicationService.Bootdata.SecurityRulesDictionary[typeName];
                var roleKeys = modelSecurityRuleDictionary.Keys.ToArray();
                var matchedRoleKeys = roleKeys.Where(r => IsInRole(r) || r == "everyone");


                if (matchedRoleKeys != null)
                {
                    foreach (var roleKey in matchedRoleKeys)
                    {
                        var rule = modelSecurityRuleDictionary[roleKey];
                        if (rule.AllowDelete)
                        {
                            allow = true;
                        }
                    }
                }
            }
            return allow;
        }

        private bool IsInRole(string role)
        {
            return User.HasClaim(ClaimTypes.Role, role);
        }
        #endregion
    }
}
