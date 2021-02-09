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

       

        [HttpGet("GetVendor")]
        public async Task<object> GetFoodMenu()
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Projects/GetAllProjects";
            return await MethodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }


    }
}
