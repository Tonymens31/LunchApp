using System;

namespace Lunch_App.Models
{
    public class GetMenu
    {

        
        public Guid MainDishId { get; set; }

         public Guid Id { get; set; }
       

        public Guid SideDishId { get; set; }

        public Guid CondiDishId { get; set; }

        public string MainDish { get; set; }

        public string SideDish { get; set; }

        public string CondiDish { get; set; }

        public DateTime StartAt { get; set; }

        public DateTime EndAt { get; set; }

        public string Price { get; set; }

        public int IsActive { get; set; }


    }
}