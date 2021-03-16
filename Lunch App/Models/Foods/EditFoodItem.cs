using System;

namespace Lunch_App.Models.Foods
{
    public class EditFoodItem
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid TypeId { get; set; }

        public Guid VendorId { get; set; }

        public int IsActive { get; set; }
    }
}
