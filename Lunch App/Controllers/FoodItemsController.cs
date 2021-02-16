using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Services;
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
    public class FoodItemsController : ControllerBase
    {
        public IHelperInterface helperInterface;
        private readonly HCMAdminHTTPClient _hcmAdminClient;

        public string LunchAppUrl = IDPSettings.Current.LunchAppUrl;
        public string Token = ""; //

        public FoodItemsController(IHelperInterface _helperInterface, HCMAdminHTTPClient hcmAdminClient)
        {
            helperInterface = _helperInterface;
            _hcmAdminClient = hcmAdminClient;
        }

        [HttpPost]
        public async Task<string> GetAllFoodItems([FromBody] LunchModel mdl)
        {
            var url = $"{LunchAppUrl}/GetAllFoodItem/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> PostFoodItems([FromBody] List<LunchModel> mdl)
        {
            var url = $"{LunchAppUrl}CreateFoodItems/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost]
        public async Task<object> PutFoodItems([FromBody] LunchModel mdl)
        {
            var endpoint = $"{LunchAppUrl}/UpdateVendors/{mdl.pkId}/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(endpoint, "PUT", false);
        }

    }
}
