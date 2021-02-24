using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Menu
{
    public class GetAllFoodInCat
    {
        public IEnumerable<CommonDish> MainDish { get; set; }
        public IEnumerable<CommonDish> SideDish { get; set; }
        public IEnumerable<CommonDish> CondiDish { get; set; }
    }
    public class CommonDish
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

   

    
}
