using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Orders
{
    public class EditOrders
    {
        public Guid Id { get; set; }

        public Guid MainDishId { get; set; }

        public Guid SideDishId { get; set; }

        public Guid CondiDishId { get; set; }

        public DateTime OrderDate { get; set; }

         public string Price { get; set; }

    }
}
