using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Orders
{
    public class SendOrders
    {
        
        public string Name { get; set; }
         public Guid MainDishId { get; set; }

         public Guid SideDishId { get; set; }

         public string OrderDate  { get; set; }

         public Guid CondiDishId { get; set; }
         public Guid MenuId { get; set; }


    }
}
