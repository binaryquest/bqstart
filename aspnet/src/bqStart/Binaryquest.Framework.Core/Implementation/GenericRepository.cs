using BinaryQuest.Framework.Core.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        internal DbContext context;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(DbContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!string.IsNullOrWhiteSpace(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split
                    (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }
            else
            {
                return query;
            }
        }

        public virtual TEntity? GetByID(object[] id, string includeProperties = "")
        {

            return GetByIdQuery(id, includeProperties).FirstOrDefault();
            //var retObj = dbSet.Find(id);

            //if (retObj != null)
            //{
            //    if (!string.IsNullOrWhiteSpace(includeProperties))
            //    {
            //        foreach (var includeProperty in includeProperties.Split
            //            (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            //        {
            //            if (retObj.GetType().GetProperty(includeProperty).PropertyType.Name == "ICollection`1")
            //            {
            //                context.Entry<TEntity>(retObj).Collection(includeProperty).Load();
            //            }
            //            else
            //            {
            //                context.Entry<TEntity>(retObj).Reference(includeProperty).Load();
            //            }
            //        }
            //    }
            //}

            //return retObj;
        }

        public virtual void Insert(TEntity entity)
        {
            dbSet.Add(entity);
        }

        public virtual void Delete(object[] id)
        {
            TEntity? entityToDelete = dbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity? entityToDelete)
        {
            if (entityToDelete == null)
                return;

            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public IQueryable<TEntity> GetByIdQuery(object[] keyValues, string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet.AsNoTracking();            

            var keys = context.Model.FindEntityType(typeof(TEntity))!.FindPrimaryKey()!.Properties;

            if (keys.Count == 1)
            {
                var prop = keys[0];
                query = query.Where(e => EF.Property<object>(e, prop.Name) == keyValues.First());
            }
            else if (keys.Count == 2)
            {
                var prop1 = keys[0];
                var prop2 = keys[1];
                query = query.Where(e => EF.Property<object>(e, prop1.Name) == keyValues[0]
                && EF.Property<object>(e, prop2.Name) == keyValues[1]);
            }
            else if (keys.Count == 3)
            {
                var prop1 = keys[0];
                var prop2 = keys[1];
                var prop3 = keys[1];
                query = query.Where(e => EF.Property<object>(e, prop1.Name) == keyValues[0]
                && EF.Property<object>(e, prop2.Name) == keyValues[1]
                && EF.Property<object>(e, prop3.Name) == keyValues[2]);
            }
            else
            {
                throw new NotSupportedException("Composite key of more than 3 property not supported");
            }

            if (!string.IsNullOrWhiteSpace(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split
                    (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            return query;
        }

        public void Attach(TEntity entity)
        {
            dbSet.Attach(entity);
        }
    }
}
