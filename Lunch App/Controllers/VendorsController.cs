using Lunch_App.Data;
using Lunch_App.Models.Common;
using Lunch_App.Models.People;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorsController : ControllerBase
    {
        private readonly IAPIServices _services;
        public VendorsController(IAPIServices services)
        {
            _services = services;
        }

        [HttpPost("GetAllVendors", Name = "GetAllVendors")]
        public async Task<IActionResult> GetAllVendors([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Vendor/GetAllVendor/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<VendorData>>(url);
            return new JsonResult(results);
        }
    }

    
}
