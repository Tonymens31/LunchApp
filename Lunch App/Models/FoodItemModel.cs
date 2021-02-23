using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models
{
    public class FoodItemModel
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public Guid TypeId { get; set; }
        public Guid VendorId { get; set; }
        public int IsActive { get; set; }
        public Guid PkId { get; set; }
        public string Type { get; set; }

    }
}

