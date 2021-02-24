using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Menu
{
    public class GetAllFoodInCat
    {
        public MainDish mainDish { get; set; }
        public SideDish sideDish { get; set; }
        public Condiment condiDish { get; set; }
    }
    public class MainDish
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class Condiment
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class SideDish
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
