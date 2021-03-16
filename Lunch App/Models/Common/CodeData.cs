﻿using System;

namespace Lunch_App.Models.Common
{
    public class CodeData
    {
        public Guid Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int IsActive { get; set; }

    }
}
