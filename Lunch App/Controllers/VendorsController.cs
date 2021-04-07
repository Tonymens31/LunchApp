
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

        [HttpPost("CreateFoodVendor/{CompanyId}", Name = "CreateFoodVendor")]
        public async Task<IActionResult> CreateFoodVendor([FromBody] IEnumerable<SendData> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Vendor/CreateVendors/{CompanyId}";
            var results = await _services.PostAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }

        [HttpPost("UpdateFoodVendor/{CompanyId}", Name = "UpdateFoodVendor")]
        public async Task<IActionResult> UpdateFoodVendor([FromBody] EditVendors model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Vendor/UpdateVendors/{model.Id}/{CompanyId}";
            var results = await _services.PutAsync<string>(url, model);
            return new JsonResult(results);
        }

        [HttpPost("DeleteFoodVendor/{Id}/{CompanyId}", Name = "DeleteFoodVendor")]
        public async Task<IActionResult> DeleteFoodVendor(Guid Id, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Vendor/DeleteVendors/{Id}/{CompanyId}";
            var results = await _services.DelAsync<string>(url, null);
            return new JsonResult(results);
        }
    }

}
