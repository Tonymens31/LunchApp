using System;

namespace Lunch_App.Models.Foods
{
    public class SendFoodItem
    {
        public string Name { get; set; }

        public Guid TypeId { get; set; }

        public Guid VendorId { get; set; }

        public int IsActive { get; set; }
    }
}
