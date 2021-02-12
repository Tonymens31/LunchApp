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
   
    [Route("[controller]")]
    [ApiController]
    public class APICallsController : ControllerBase
    {
        MethodAPIRequest MethodAPIRequest = new MethodAPIRequest();

        public IConfiguration Configuration { get; set; }
        public APICallsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

       

        [HttpGet("GetAllVendor/{companyid}")]
        public async Task<object> GetAllVendors(string companyid)
        {
            var endpoint = Config.Current.LunchAppUrl+"GetAllVendor/"+companyid;
            return await MethodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpPost("api/createVendors/{companyId}")]
        public async Task<object> PostVendor([FromBody] object data)
        {
            var endpoint =$"{Configuration["APISETTINGS:LunchAppMicroservice"]}Vendors/CreateVendor";
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
