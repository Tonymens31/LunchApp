using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Orders
{
    public class GetMenusByDate
    {
        public DateTime Date { get; set; }
        public IEnumerable<OrderDish> MainDish { get; set; }
        public IEnumerable<OrderDish> SideDish { get; set; }
        public IEnumerable<OrderDish> CondiDish { get; set; }

    }

    public class OrderDish
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

    }
}
