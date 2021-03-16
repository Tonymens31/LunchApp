using Lunch_App.Data;
using Lunch_App.Models.Common;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodesController : ControllerBase
    {
        private readonly IAPIServices _services;
        public CodesController(IAPIServices services)
        {
            _services = services;
        }

        [HttpPost("GetAllCodes", Name = "GetAllCodes")]
        public async Task<IActionResult> GetAllCodes([FromBody] FieldData model)
        {
            var url = $"{IDPSettings.Current.LunchAppUrl}GetAllCodes/{model.Code}";
            var results = await _services.GetAsync<IEnumerable<CodeData>>(url);
            return new JsonResult(results);
        }
    }
}
