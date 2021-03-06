﻿using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{



    public class APICallsController : ControllerBase
    {
        public IHelperInterface helperInterface;
        private readonly HCMAdminHTTPClient _hcmAdminClient;

        public string LunchAppUrl = IDPSettings.Current.LunchAppUrl;
        public string Token = ""; //

        public APICallsController(IHelperInterface _helperInterface, HCMAdminHTTPClient hcmAdminClient)
        {
            helperInterface = _helperInterface;
            _hcmAdminClient = hcmAdminClient;
        }

        [HttpPost]
        public async Task<string> GetAllVendors([FromBody] LunchModel mdl)
        {
            var url = $"{LunchAppUrl}Vendor/GetAllVendor/{mdl.CompanyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> PostVendor([FromBody] List<LunchModel> mdl)
        {
            var url = $"{LunchAppUrl}Vendor/CreateVendors/{mdl[0].CompanyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost]
        public async Task<object> PutVendor([FromBody] LunchModel mdl)
        {
            var url = $"{LunchAppUrl}Vendor/UpdateVendors/{mdl.pkId}/{mdl.CompanyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "PUT", false, mdl);
        } 

         [HttpPost]
        public async Task<object> DeleteVendor([FromBody] LunchModel mdl)
        {
            var url = $"{LunchAppUrl}Vendor/DeleteVendors/{mdl.pkId}/{mdl.CompanyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "DELETE", false);
        } 
        
       
    }
}
