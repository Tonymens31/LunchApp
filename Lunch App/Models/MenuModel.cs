using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Models
{
    public class MenuModel
    {
        public string companyId { get; set; }
        public string mainDishId { get; set; }
        public string sideDishId { get; set; }
        public string condiDishId { get; set; }
        public string mainDish { get; set; }
        public string sideDish { get; set; }
        public string condiDish { get; set; }
        public string startAt { get; set; }
        public string endAt { get; set; }
        public string price { get; set; }
        public int isActive { get; set; }
        public string pkId { get; set; }

    }
}