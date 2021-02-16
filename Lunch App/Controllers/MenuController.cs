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

    public class MenuController : ControllerBase
    {
        public IHelperInterface helperInterface;
        private readonly HCMAdminHTTPClient _hcmAdminClient;

        public string LunchAppUrl = IDPSettings.Current.LunchAppUrl;
        public string Token = ""; //

        public MenuController(IHelperInterface _helperInterface, HCMAdminHTTPClient hcmAdminClient)
        {
            helperInterface = _helperInterface;
            _hcmAdminClient = hcmAdminClient;
        }

        [HttpPost]
        public async Task<string> GetAllMenus([FromBody] MenuModel mdl)
        {
            var url = $"{LunchAppUrl}GetAllMenu/{mdl.companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        }

        [HttpPost]
        public async Task<string> PostVendor([FromBody] List<MenuModel> mdl)
        {
            var url = $"{LunchAppUrl}CreateMenus/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        }

        [HttpPost("PutMenu/{pkId}")]
        public async Task<object> PutVendor([FromBody] List<MenuModel> mdl, string pkId)
        {
            var url = $"{LunchAppUrl}UpdateMenus/{pkId}/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "PUT", false);
        }

        [HttpPost]
        public async Task<object> DeleteVendor([FromBody] List<MenuModel> mdl, string pkId)
        {
            var url = $"{LunchAppUrl}/DeleteVendors/{pkId}/{mdl[0].companyId}";
            return await _hcmAdminClient.SendDataToAPI(url, "DELETE", false);
        }


    }
}

