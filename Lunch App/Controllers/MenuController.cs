﻿using Lunch_App.Data;
using Lunch_App.Models;
using Lunch_App.Models.Common;
using Lunch_App.Models.Menu;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
            var url = $"{IDPSettings.Current.LunchAppUrl}Menus/GetAllMenu/{model.Id}";
            var results = await _services.GetAsync<IEnumerable<GetMenu>>(url);
            return new JsonResult(results);
        }

         [HttpPost("GetAllFoodInCats", Name = "GetAllFoodInCats")]
        public async Task<IActionResult> GetAllFoodInCats([FromBody] IdData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}FoodItems/GetAllFoodItemsInCat/{model.Id}";
            var results = await _services.GetAsync<GetAllFoodInCat> (url);
            return new JsonResult(results);
        }


        [HttpPost("CreateMenu/{CompanyId}", Name = "CreateMenu")]
        public async Task<IActionResult> CreateMenu([FromBody] IEnumerable<SendMenu> model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Menus/CreateMenus/{CompanyId}";
            var results = await _services.PostAsync<IEnumerable<Guid>>(url, model);
            return new JsonResult(results);
        }
        
        
        [HttpPost("UpdateMenu/{CompanyId}", Name = "UpdateMenu")]
        public async Task<IActionResult> UpdateMenu([FromBody] EditMenu model, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Menus/UpdateMenus/{model.Id}/{CompanyId}";
            var results = await _services.PutAsync<string>(url, model);
            return new JsonResult(results);
        }

        [HttpPost("DeleteMenu/{Id}/{CompanyId}", Name = "DeleteMenu")]
        public async Task<IActionResult> DeleteMenu(Guid Id, Guid CompanyId)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}Menus/DeleteMenus/{Id}/{CompanyId}";
            var results = await _services.DelAsync<string>(url, null);
            return new JsonResult(results);
        }
    }
}


