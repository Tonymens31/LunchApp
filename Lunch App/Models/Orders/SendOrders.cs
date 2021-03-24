using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Orders
{
    public class SendOrders
    {
        public Guid MenuId { get; set; }

         public Guid MainDishId { get; set; }

         public Guid SideDishId { get; set; }

         public DateTime OrderDate  { get; set; }

         public double Price { get; set; }

    }
}
