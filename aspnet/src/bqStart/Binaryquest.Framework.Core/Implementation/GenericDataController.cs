using BinaryQuest.Framework.Core.Data;
using BinaryQuest.Framework.Core.Exceptions;
using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public abstract class BaseGenericDataController<TEntity, TKey> : DataController<TEntity, TKey> where TEntity : class
    {
        private readonly ILogger<BaseGenericDataController<TEntity, TKey>> logger;
        protected readonly IUnitOfWork unitOfWork;

        public BaseGenericDataController([NotNull]IApplicationService applicationService, [NotNull]ILogger<BaseGenericDataController<TEntity, TKey>> logger, [NotNull]IUnitOfWork unitOfWork) : base(applicationService)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }        

        protected override IQueryable OnGetData()
        {
            var results = this.unitOfWork.GenericRepository<TEntity>().Get(includeProperties: ExpandedTables);

            if (SecurityWhereClause != null)
            {
                results = results.Where(SecurityWhereClause);
            }

            return results;
        }


        protected override dynamic OnGetLookupStageData()
        {
            throw new NotImplementedException();
        }

        public override TEntity OnGetSingleData(object[] keyValues)
        {
            return this.unitOfWork.GenericRepository<TEntity>().GetByID(keyValues, ExpandedTablesForSingleEntity);            
        }        

        protected override async Task<IActionResult> OnInsert(TEntity entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (SecurityWhereClause != null)
                {
                    Func<TEntity, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }

                if (entity is ILoggingEntity log)
                {
                    log.CreatedOn = DateTime.UtcNow;
                    log.CreatedBy = this.User.Identity.Name;
                }

                OnBeforeCreate(entity);

                this.unitOfWork.GenericRepository<TEntity>().Insert(entity);

                await this.unitOfWork.SaveAsync();

                OnAfterCreate(entity);

                return Created(entity);
            }
            catch (DbEntityValidationException devexp)
            {
                string msg = "Database Integrity Error. ";
                if (devexp.InnerException != null)
                {
                    msg += devexp.InnerException.Message;
                }
                logger.LogError("Error OnInsert {0}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnInsert {0}", msg);
                return UnprocessableEntity(msg);
            }
            catch (DbUpdateException duexp)
            {
                string msg = "Database Integrity Error. ";
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

        protected override async Task<IActionResult> OnUpdate(TEntity entity)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!OnValidate(entity))
                    return BadRequest();

                if (SecurityWhereClause != null)
                {
                    Func<TEntity, bool> secFunc = SecurityWhereClause.Compile();
                    if (secFunc(entity) == false)
                    {
                        return UnprocessableEntity();
                    }
                }

                if (entity is ILoggingEntity log)
                {
                    log.ModifiedOn = DateTime.UtcNow;
                    log.ModifiedBy = this.User.Identity.Name;
                }

                OnBeforeEdit(entity);

                this.unitOfWork.GenericRepository<TEntity>().Update(entity);

                await this.unitOfWork.SaveAsync();

                OnAfterEdit(entity);

                return Updated(entity);
            }
            catch (DbEntityValidationException devexp)
            {
                string msg = "Database Integrity Error. ";
                if (devexp.InnerException != null)
                {
                    msg += devexp.InnerException.Message;
                }
                logger.LogError("Error OnUpdate {0}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnUpdate {0}", msg);
                return UnprocessableEntity(msg);
            }
            catch (DbUpdateException duexp)
            {
                string msg = "Database Integrity Error. ";
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

        protected override async Task<IActionResult> OnDelete(TEntity entity)
        {
            try
            {
                OnBeforeDelete(entity);

                this.unitOfWork.GenericRepository<TEntity>().Delete(entity);

                await this.unitOfWork.SaveAsync();

                OnAfterDelete(entity);

                return Ok(entity);
            }
            catch (DbEntityValidationException devexp)
            {
                string msg = "Database Integrity Error. ";
                if (devexp.InnerException != null)
                {
                    msg += devexp.InnerException.Message;
                }
                logger.LogError("Error OnDelete {0}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnDelete {0}", msg);
                return UnprocessableEntity(msg);
            }
            catch (DbUpdateException duexp)
            {
                string msg = "Database Integrity Error. ";
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
                if (msg.Contains("DELETE statement conflicted with the REFERENCE"))
                {
                    msg = "Can not delete this record as related records must be deleted first. ";
                }
                logger.LogError("Error OnDelete {0}", msg);
                return Conflict(msg);
            }
        }

        protected override ModelMetadata OnGetModelMetaData()
        {
            if (this.applicationService.Bootdata.MetaDataValues.ContainsKey(typeof(TEntity)))
            {
                var md = this.applicationService.Bootdata.MetaDataValues[typeof(TEntity)];
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

    }

    public abstract class GenericDataController<TEntity, TKey> : BaseGenericDataController<TEntity, TKey> where TEntity : class
    {
        protected GenericDataController([NotNull] IApplicationService applicationService, [NotNull] ILogger<BaseGenericDataController<TEntity, TKey>> logger, [NotNull] IUnitOfWork unitOfWork) : base(applicationService, logger, unitOfWork)
        {
        }


        [EnableQuery]
        [HttpGet()]        
        public IActionResult Get([FromODataUri] TKey key)
        {
            return GetInternal(new object[] { key });
        }
    }

    

    public abstract class GenericDataController<TEntity, TKey1, TKey2> : BaseGenericDataController<TEntity, TKey1> where TEntity : class
    {
        protected GenericDataController([NotNull] IApplicationService applicationService, [NotNull] ILogger<GenericDataController<TEntity, TKey1, TKey2>> logger, [NotNull] IUnitOfWork unitOfWork) : base(applicationService, logger, unitOfWork)
        {
        }


        [EnableQuery]
        [HttpGet]
        public IActionResult Get([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2)
        {
            return GetInternal(new object[] { key1, key2 });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2)
        {
            if (!AllowDelete())
            {
                return Unauthorized();
            }

            TEntity entity = OnGetSingleData(new object[] { key1, key2 });

            return await OnDelete(entity);
        }
    }

    public abstract class GenericDataController<TEntity, TKey1, TKey2, TKey3> : BaseGenericDataController<TEntity, TKey1> where TEntity : class
    {
        protected GenericDataController([NotNull] IApplicationService applicationService, [NotNull] ILogger<GenericDataController<TEntity, TKey1, TKey2, TKey3>> logger, [NotNull] IUnitOfWork unitOfWork) : base(applicationService, logger, unitOfWork)
        {
        }

        [EnableQuery]
        [HttpGet]
        public IActionResult Get([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2, [FromODataUri] TKey3 key3)
        {
            return GetInternal(new object[] { key1, key2, key3 });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2, [FromODataUri] TKey3 key3)
        {
            if (!AllowDelete())
            {
                return Unauthorized();
            }

            TEntity entity = OnGetSingleData(new object[] { key1, key2, key3 });

            return await OnDelete(entity);
        }
    }
}
