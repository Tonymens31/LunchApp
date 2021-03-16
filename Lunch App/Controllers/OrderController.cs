using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Common;
using Lunch_App.Services;
using Lunch_App.Models.Orders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly IAPIServices _services;
        public OrderController(IAPIServices services)
        {
            _services = services;
        }

        [HttpPost("GetOrders", Name = "GetOrders")]
        public async Task<IActionResult> GetOrders([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllOrder/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<Models.GetOrders>>(url);
            return new JsonResult(results);
        }

    }
}
