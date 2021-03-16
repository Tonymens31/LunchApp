using System;

namespace Lunch_App.Models.Menu
{
    public class SendMenu
    {

        public Guid Id { get; set; }

        public Guid MainDishId { get; set; } 

        public string MainDish { get; set; }

        public Guid SideDishId { get; set; } 

        public string SideDish { get; set; }

         public Guid CondiDishId { get; set; } 
        
        public string CondiDish { get; set; }

         public string Price { get; set; }

         public DateTime StartAt { get; set; }

         public DateTime EndAt { get; set; }

    }
}
