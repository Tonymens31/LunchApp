using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Foods;
using Lunch_App.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{

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
        public async Task<string> GetAllFoodItems([FromBody] FoodItemModel mdl)
        {
            var url = $"{LunchAppUrl}GetAllFoodItem/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }


        [HttpPost]
        public async Task<string> GetAllCode([FromBody] FoodItemModel mdl)
        {
            var url = $"{LunchAppUrl}GetAllCodes/{mdl.type}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }
       
        [HttpPost]
        public async Task<string> PostFoodItems([FromBody] List<FoodItemModel> mdl)
        {
            var url = $"{LunchAppUrl}CreateFoodItems/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost]
        public async Task<object> PutFoodItems([FromBody] FoodItemModel mdl)
        {
            var endpoint = $"{LunchAppUrl}UpdateFoodItems/{mdl.pkId}/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(endpoint, "PUT", false, mdl);
        }

    }
}
