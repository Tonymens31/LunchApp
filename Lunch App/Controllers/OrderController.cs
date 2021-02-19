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
    public class OrderController : ControllerBase
    {
        public IHelperInterface helperInterface;
        private readonly HCMAdminHTTPClient _hcmAdminClient;

        public string LunchAppUrl = IDPSettings.Current.LunchAppUrl;
        public string Token = ""; //

        public OrderController(IHelperInterface _helperInterface, HCMAdminHTTPClient hcmAdminClient)
        {
            helperInterface = _helperInterface;
            _hcmAdminClient = hcmAdminClient;
        }

        [HttpPost]
        public async Task<string> GetAllOrders([FromBody] OrderModel mdl)
        {
            var url = $"{LunchAppUrl}/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> GetAllOrdersByDate([FromBody] OrderModel mdl)
        {
            var url = $"{LunchAppUrl}/{mdl.pkId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> CreateOrder([FromBody] List<OrderModel> mdl)
        {
            var url = $"{LunchAppUrl}/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost]
        public async Task<object> UpdateOrder([FromBody] OrderModel mdl)
        {
            var url = $"{LunchAppUrl}/{mdl.pkId}/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "PUT", false, mdl);
        }

        [HttpPost]
        public async Task<object> DeleteVendor([FromBody] List<OrderModel> mdl, string pkId)
        {
            var url = $"{LunchAppUrl}/DeleteVendors/{pkId}/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "DELETE", false);
        }


    }
}
