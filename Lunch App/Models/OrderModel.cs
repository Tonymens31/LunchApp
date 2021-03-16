using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models
{
    public class OrderModel
    {
        public Guid CompanyId { get; set; }

        public Guid MainDishId { get; set; }

        public string SideDishId { get; set; }

        public string CondiDishId { get; set; }

        public string MainDish { get; set; }

        public string SideDish { get; set; }

        public string CondiDish { get; set; }
       
        public DateTime Orderdate { get; set; }

        public int Price { get; set; }

        public string PkId { get; set; }
    }
}
