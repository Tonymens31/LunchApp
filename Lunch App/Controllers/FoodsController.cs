using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Common;
using Lunch_App.Models.Foods;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodsController : ControllerBase
    {
        private readonly IAPIServices _services;
        public FoodsController(IAPIServices services)
        {
            _services = services;
        }

        [HttpPost("GetFoodItems", Name = "GetFoodItems")]
        public async Task<IActionResult> GetFoodItems([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllFoodItem/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<GetFoodItem>>(url);
            return new JsonResult(results);
        }

        [HttpPost("CreateFoodItem/{CompanyId}", Name = "CreateFoodItem")]
        public async Task<IActionResult> CreateFoodItem([FromBody] IEnumerable<SendFoodItem> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}CreateFoodItems/{CompanyId}";
            var results = await _services.PostAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }
         [HttpPost("updateFoodItem/{CompanyId}", Name = "updateFoodItem")]
        public async Task<IActionResult> UpdateFoodItem([FromBody] IEnumerable<SendFoodItem> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}CreateFoodItems/{CompanyId}";
            var results = await _services.PutAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }

    }
}
