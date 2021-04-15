using Lunch_App.Data;
using Lunch_App.Models.Common;
using Lunch_App.Models.Foods;
using Lunch_App.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lunch_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IAPIServices _services;
        public ReportController(IAPIServices services)
        {
            _services = services;
        }
    }
}
