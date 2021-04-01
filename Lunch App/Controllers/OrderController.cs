using Lunch_App.Data;
using Lunch_App.Models.Common;
using Lunch_App.Services;
using Lunch_App.Models.Orders;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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
            var url = $"{IDPSettings.Current.LunchAppUrl}OrderTrans/GetAllOrder/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<GetOrders>>(url);
            return new JsonResult(results);
        }

        [HttpPost("CreateOrder/{CompanyId}", Name = "CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] IEnumerable<SendOrders> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}OrderTrans/CreateOrders/{CompanyId}";
            var results = await _services.PostAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }
    }
}
