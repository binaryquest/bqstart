﻿using BinaryQuest.Framework.Core.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Data
{
    public abstract class BaseEntity<T> : ILoggingEntity, INotPersistingProperties
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public T Id { get; set; } = default!;

        /// <summary>
        /// when this entity was inserted
        /// </summary>
        public DateTime? CreatedOn { get; set; }
        /// <summary>
        /// when this entity was modified
        /// </summary>
        public DateTime? ModifiedOn { get; set; }
        /// <summary>
        /// user name who created this identity
        /// </summary>
        [StringLength(256)]
        public string? CreatedBy { get; set; }
        /// <summary>
        /// user name who modified this entity
        /// </summary>
        [StringLength(256)]
        public string? ModifiedBy { get; set; }

        /// <summary>
        /// this is a place holder type for working out if the entity has been modified from
        /// frontend. not mapped in EF. 
        /// </summary>        
        public RecordState RecordState { get; set; }
    }

    public abstract class BaseKeyStringEntity : ILoggingEntity, INotPersistingProperties
    {
        [Key]
        [StringLength(128)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; } = null!;

        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        
        [StringLength(256)]        
        public string? CreatedBy { get; set; }

        [StringLength(256)]
        public string? ModifiedBy { get; set; }
        
        public RecordState RecordState { get; set; }
    }

    public enum RecordState
    {
        Unchanged = 0,
        Inserted = 1,
        Modified = 2,
        Deleted = 3
    }
}
