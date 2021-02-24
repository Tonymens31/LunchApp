using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Common;
using Lunch_App.Models.Menu;
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
    public class MenuController : ControllerBase
    {
        private readonly IAPIServices _services;
        public MenuController(IAPIServices services)
        {
            _services = services;
        }


        [HttpPost("GetAllMenus", Name = "GetAllMenus")]
        public async Task<IActionResult> GetAllMenus([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllMenu/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<GetMenu>>(url);
            return new JsonResult(results);
        }

         [HttpPost("GetAllFoodInCats", Name = "GetAllFoodInCats")]
        public async Task<IActionResult> GetAllFoodInCats([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllFoodItemsInCat/{model.Id}";
            var results = await _services.GetAsync<GetAllFoodInCat> (url);
            return new JsonResult(results);
        }


        [HttpPost("CreateMenu/{CompanyId}", Name = "CreateMenu")]
        public async Task<IActionResult> CreateMenu([FromBody] IEnumerable<SendMenu> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}CreateMenus/{CompanyId}";
            var results = await _services.PostAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }
        //[HttpPost]
        //public async Task<string> GetAllMenus([FromBody] MenuModel mdl)
        //{
        //    var url = $"{LunchAppUrl}GetAllMenu/{mdl.CompanyId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        //}

        // [HttpPost]
        //public async Task<string> GetAllMenusByCat([FromBody] MenuModel mdl)
        //{
        //    var url = $"{LunchAppUrl}GetAllFoodItemsInCat/{mdl.CompanyId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        //}

        //[HttpPost]
        //public async Task<string> GetSingleCode([FromBody] FoodItemModel mdl)
        //{
        //    var url = $"{LunchAppUrl}GetSingleCodes/{mdl.PkId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "GET", false);
        //}

        //[HttpPost]
        //public async Task<string> PostMenu([FromBody] List<MenuModel> mdl)
        //{
        //    var url = $"{LunchAppUrl}CreateMenus/{mdl[0].CompanyId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "POST", false, mdl);
        //}

        //[HttpPost]
        //public async Task<object> PutMenu([FromBody] MenuModel mdl)
        //{
        //    var url = $"{LunchAppUrl}UpdateMenus/{mdl.PkId}/{mdl.CompanyId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "PUT", false);
        //}

        //[HttpPost]
        //public async Task<object> DeleteVendor([FromBody] List<MenuModel> mdl, string pkId)
        //{
        //    var url = $"{LunchAppUrl}/DeleteVendors/{pkId}/{mdl[0].CompanyId}";
        //    return await _hcmAdminClient.SendDataToAPI(url, "DELETE", false);
        //}


    }
}

