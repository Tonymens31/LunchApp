using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Foods
{
    public class GetFoodItem
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid TypeId { get; set; }

        public Guid VendorId { get; set; }

        public string Type { get; set; }

        public string Vendor { get; set; }

        public int IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // public string DeletedAt { get; set; }

    }
}
