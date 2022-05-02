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
        protected readonly ILogger<BaseGenericDataController<TEntity, TKey>> logger;
        protected readonly IUnitOfWork unitOfWork;

        public BaseGenericDataController([NotNull]IApplicationService applicationService, [NotNull]ILogger<BaseGenericDataController<TEntity, TKey>> logger, [NotNull]IUnitOfWork unitOfWork) : base(applicationService)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }        

        protected override Task<IQueryable<TEntity>> OnGetData()
        {
            
            var results = this.unitOfWork.GenericRepository<TEntity>().Get(includeProperties: ExpandedTables);

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

        public override async Task<TEntity?> OnGetSingleData(object[] keyValues)
        {
            await Task.Delay(10);
            return this.unitOfWork.GenericRepository<TEntity>().GetByID(keyValues, ExpandedTablesForSingleEntity);            
        }        

        protected override async Task<IActionResult> OnInsert(TEntity? entity)
        {
            try
            {
                if (entity == null)
                    return BadRequest();

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
                    log.CreatedBy = this.CurrentUser?.UserId;
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
                logger.LogError("Error OnInsert {msg}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnInsert {msg}", msg);
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
                logger.LogError("Error OnInsert {msg}", msg);
                return UnprocessableEntity(msg);
            }
        }

        protected override async Task<IActionResult> OnUpdate(TEntity? entity)
        {
            try
            {
                if (entity == null)
                    return BadRequest();

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
                    log.ModifiedBy = this.CurrentUser?.UserId;
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
                logger.LogError("Error OnUpdate {msg}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnUpdate {msg}", msg);
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
                logger.LogError("Error OnUpdate {msg}", msg);
                return UnprocessableEntity(msg);
            }
        }

        protected override async Task<IActionResult> OnDelete(TEntity? entity)
        {
            try
            {
                if (entity == null)
                    return BadRequest();

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
                logger.LogError("Error OnDelete {msg}", msg);
                return BadRequest(msg);
            }
            catch (DbUpdateConcurrencyException ducexp)
            {
                string msg = "Record has been modified by someone else. Please reload this to get the latest data. ";
                if (ducexp.InnerException != null)
                {
                    msg += ducexp.InnerException.Message;
                }
                logger.LogError("Error OnDelete {msg}", msg);
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
                logger.LogError("Error OnDelete {msg}", msg);
                return Conflict(msg);
            }
        }

        protected override ModelMetadata? OnGetModelMetaData()
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
                return null;
            }
        }

        /// <summary>
        /// This function is a helper method to parse an objects child collection
        /// to persist in database by using the recordState property to determine
        /// if it's inserted or updated or deleted.        
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="objectLines"></param>
        /// <example>
        /// protected override void OnBeforeEdit(Order entity)
        /// {
        ///     UpdateChildObjectsTree<OrderDetails>(entity.Details);
        /// }
        /// </example>
        protected void UpdateChildObjectsTree<T>(ICollection<T> objectLines) where T : BaseEntity<TKey>
        {
            if (objectLines.Count > 0)
            {
                List<T> deletedList = new List<T>();
                // List<History> HistoryList = new List<History>();
                foreach (var row in objectLines)
                {
                    if (row.RecordState == RecordState.Inserted)
                    {
                        if (row is ILoggingEntity loggingEntity)
                        {
                            loggingEntity.CreatedOn = DateTime.UtcNow;
                            loggingEntity.CreatedBy = this.CurrentUser.UserId;
                        }
                        this.unitOfWork.GenericRepository<T>().Insert(row);
                    }
                    else if (row.RecordState == RecordState.Deleted)
                    {
                        this.unitOfWork.GenericRepository<T>().Delete(row);
                        deletedList.Add(row);
                    }
                    else
                    {
                        this.unitOfWork.GenericRepository<T>().Update(row);
                    }
                }

                //lets delete the child rows from collection as otherwise on update of
                //main entity it will cause error
                for (int i = 0; i < deletedList.Count; i++)
                {
                    objectLines.Remove(deletedList[i]);
                }
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
        public Task<IActionResult> Get([FromODataUri] TKey key)
        {
            if (key == null)
            {
                return Task.FromResult<IActionResult>(NotFound());
            }
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
        public Task<IActionResult> Get([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2)
        {
            if (key1 != null && key2 != null)
            {
                return GetInternal(new object[] { key1, key2 });
            }
            else
            {
                return Task.FromResult<IActionResult>(NotFound());
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2)
        {
            if (!AllowDelete())
            {
                return Unauthorized();
            }

            if (key1 != null && key2 != null)
            {
                TEntity? entity = await OnGetSingleData(new object[] { key1, key2 });
                return await OnDelete(entity);
            }
            else
            {
                return NotFound();
            }
        }
    }

    public abstract class GenericDataController<TEntity, TKey1, TKey2, TKey3> : BaseGenericDataController<TEntity, TKey1> where TEntity : class
    {
        protected GenericDataController([NotNull] IApplicationService applicationService, [NotNull] ILogger<GenericDataController<TEntity, TKey1, TKey2, TKey3>> logger, [NotNull] IUnitOfWork unitOfWork) : base(applicationService, logger, unitOfWork)
        {
        }

        [EnableQuery]
        [HttpGet]
        public Task<IActionResult> Get([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2, [FromODataUri] TKey3 key3)
        {
            if (key1 != null && key2 != null && key3 != null)
            {
                return GetInternal(new object[] { key1, key2, key3 });
            }
            else
            {
                return Task.FromResult<IActionResult>(NotFound());
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromODataUri] TKey1 key1, [FromODataUri] TKey2 key2, [FromODataUri] TKey3 key3)
        {
            if (!AllowDelete())
            {
                return Unauthorized();
            }

            if (key1 != null && key2 != null && key3 != null)
            {
                TEntity? entity = await OnGetSingleData(new object[] { key1, key2, key3 });
                return await OnDelete(entity);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
