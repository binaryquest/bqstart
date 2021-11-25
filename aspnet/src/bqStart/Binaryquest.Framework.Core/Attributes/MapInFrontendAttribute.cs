using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core
{
    /// <summary>This is a marker class to select a property meta data to be included in the 
    /// frontend is that property is also maked as <see cref="System.ComponentModel.DataAnnotations.Schema.NotMappedAttribute" />
    /// for EntityFramework.</summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, Inherited = false, AllowMultiple = true)]
    public sealed class MapInFrontendAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MapInFrontendAttribute"/> class.
        /// </summary>
        public MapInFrontendAttribute()
        {

        }
    }
}
