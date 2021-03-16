using System;

namespace Lunch_App.Models.Orders
{
    public class GetOrders
    {
        public Guid Id { get; set; } 

        public DateTime OrderDate { get; set; }

        public Guid MainDishId { get; set; }

        public Guid SideDishId { get; set; }

        public Guid CondiDishId { get; set; }

        public double Price { get; set; }

        public string MainDish { get; set; }

         public string SideDish { get; set; }

         public string CondiDish { get; set; }
        
    }
}
