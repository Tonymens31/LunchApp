using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models.Menu
{
    public class getMenu
    {
       
        public Guid mainDishId { get; set; }

        public Guid sideDishId { get; set; }

        public Guid condiDishId { get; set; } 

        public string mainDish { get; set; }  

        public string sideDish { get; set; } 
        
        public string condiDish { get; set; } 
        
        public DateTime startAt { get; set; }

         public DateTime endAt { get; set; }

    }
}
