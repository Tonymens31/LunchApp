using System;

namespace Lunch_App.Models.Menu
{
    public class EditMenu
    {

        public Guid Id { get; set; }

        public DateTime StartAt { get; set; }

        public Guid MainDishId { get; set; }

        public Guid SideDishId { get; set; }

        public string Price { get; set; }

        public Guid CondiDishId { get; set; }

        public DateTime EndAt { get; set; }

    }
}

