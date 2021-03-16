using System;

namespace Lunch_App.Models
{
    public class LunchModel
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string tel { get; set; }
        public int isActive { get; set; }
        public Guid pkId { get; set; } 
        
    }
   
}
