using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Attributes;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Implementation
{
    public interface IDataController<TEntity, TKey> where TEntity : class
    {
        string ExpandedTables { get; }
        string ExpandedTablesForSingleEntity { get; }
        Expression<Func<TEntity, bool>> SecurityWhereClause { get; }

        Task<IActionResult> Delete(TKey entity);
        Task<IActionResult> Get();

        IActionResult ModelMetaData();
        IActionResult LookupData();
        Task<IActionResult> Post(TEntity entity);
        Task<IActionResult> Patch(TEntity entity);        
    }    
}