using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Common;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemBYCateController : ControllerBase
    {
        private readonly IAPIServices _services;
        public FoodItemBYCateController(IAPIServices services)
        {
            _services = services;
        }

        [HttpPost("FoodItemByCategory", Name = "FoodItemByCategory")]
        public async Task<IActionResult> FoodItemByCategory([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllFoodItemsInCat/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<MenuModel>>(url);
            return new JsonResult(results);
        }
    }
}
