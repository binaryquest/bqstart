using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Interface
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        void Delete(object[] id);
        void Delete(TEntity entityToDelete);
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "");
        TEntity GetByID(object[] keyValues, string includeProperties = "");
        IQueryable<TEntity> GetByIdQuery(object[] keyValues, string includeProperties = "");
        void Insert(TEntity entity);
        void Update(TEntity entityToUpdate);
        void Attach(TEntity entity);
    }
}
