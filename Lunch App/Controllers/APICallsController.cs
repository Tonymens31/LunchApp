using Lunch_App.HTTPServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class APICallsController : ControllerBase
    {
        MethodAPIRequest MethodAPIRequest = new MethodAPIRequest();

        public IConfiguration Configuration { get; set; }
        public APICallsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

       

        [HttpGet("api/")]
        public async Task<object> GetFoodMenu()
        {
            var endpoint = $"{Configuration["APISETTINGS:LunchAppMicroservice"]}Vendor/GetAllVendors";
            return await MethodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpPost("api/")]
        public async Task<object> PostProject([FromBody] object data)
        {
            var endpoint = $"{Configuration["APISETTINGS:LunchAppMicroservice"]}Vendors/CreateVendor";
            return await MethodAPIRequest.MakeRequestAsync(endpoint, "POST", data);
        }

        [HttpPut("api/putvendor/{vendorId}")]
        public async Task<object> PutProject([FromBody] object data, string vendorId)
        {
            var endpoint = $"{Configuration["APISETTINGS:LunchAppMicroservice"]}Vendors/{vendorId}";
            return await MethodAPIRequest.MakeRequestAsync(endpoint, "PUT", data);
        }
    }
}
