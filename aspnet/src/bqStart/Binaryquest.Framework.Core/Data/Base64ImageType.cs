﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Data
{
    [ComplexType]
    public class Base64ImageType
    {
        public string Base64 { get; set; } = null!;
        public string Filename { get; set; } = null!;
        public long? Filesize { get; set; }
        public string Filetype { get; set; } = null!;
    }
}
