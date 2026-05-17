using BinaryQuest.Framework.Core.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;

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
            if (keys.Count != keyValues.Length)
            {
                throw new ArgumentException("The number of key values does not match the entity primary key definition.", nameof(keyValues));
            }

            Expression? predicateBody = null;
            var parameter = Expression.Parameter(typeof(TEntity), "entity");
            for (var i = 0; i < keys.Count; i++)
            {
                var prop = keys[i];
                var propertyAccess = Expression.Call(
                    typeof(EF),
                    nameof(EF.Property),
                    new[] { prop.ClrType },
                    parameter,
                    Expression.Constant(prop.Name));

                var convertedValue = ConvertKeyValue(keyValues[i], prop.ClrType);
                var valueExpression = Expression.Constant(convertedValue, prop.ClrType);

                var equalsExpression = Expression.Equal(propertyAccess, valueExpression);
                predicateBody = predicateBody == null
                    ? equalsExpression
                    : Expression.AndAlso(predicateBody, equalsExpression);
            }

            if (predicateBody == null)
            {
                throw new NotSupportedException("No key predicate could be generated for the entity type.");
            }

            var predicate = Expression.Lambda<Func<TEntity, bool>>(predicateBody, parameter);
            query = query.Where(predicate);

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

        private static object? ConvertKeyValue(object? keyValue, Type destinationType)
        {
            if (keyValue == null)
            {
                return null;
            }

            var targetType = Nullable.GetUnderlyingType(destinationType) ?? destinationType;

            if (targetType.IsEnum)
            {
                return Enum.ToObject(targetType, keyValue);
            }

            if (targetType == typeof(Guid))
            {
                return keyValue is Guid guid
                    ? guid
                    : Guid.Parse(keyValue.ToString()!);
            }

            if (targetType == typeof(string))
            {
                return keyValue.ToString();
            }

            return Convert.ChangeType(keyValue, targetType, CultureInfo.InvariantCulture);
        }

        public void Attach(TEntity entity)
        {
            dbSet.Attach(entity);
        }
    }
}
