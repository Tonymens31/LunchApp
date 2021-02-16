using Lunch_App.Data;
using Lunch_App.HTTPServices;
using Lunch_App.Models;
using Lunch_App.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var url = $"{LunchAppUrl}GetAllVendor/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> PostVendor([FromBody] List<LunchModel> mdl)
        {
            var url = $"{LunchAppUrl}CreateVendors/{mdl[0].companyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost("PutVendor/{pkId}")]
        public async Task<object> PutVendor([FromBody] List<LunchModel> mdl, string pkId)
        {
            var url = $"{LunchAppUrl}/UpdateVendors/{pkId}/{mdl[0].companyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "PUT", false);
        } 

         [HttpPost]
        public async Task<object> DeleteVendor([FromBody] List<LunchModel> mdl, string pkId)
        {
            var url = $"{LunchAppUrl}/DeleteVendors/{pkId}/{mdl[0].companyId}";
            return await  _hcmAdminClient.SendDataToAPI(url, "DELETE", false);
        } 
        
       
    }
}
