using Lunch_App.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Lunch_App.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
       
         public IActionResult FoodItem()
        {
            return View();
        }
          public IActionResult Holiday()
        {
            return View();
        }
          public IActionResult Example()
        {
            return View();
        }

          public IActionResult Menu()
        {
            return View();
        }
          public IActionResult Vendor()
        {
            return View();
        }
            public IActionResult Staff()
        {
            return View();
        }
            public IActionResult Orders()
        {
            return View();
        }
        

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
