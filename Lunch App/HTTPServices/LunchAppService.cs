using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Lunch_App.HTTPServices
{
    public class LunchAppService : ILunchAppService
    {
        static readonly HttpClient client = new HttpClient();
        public IConfiguration Configuration { get; set; }
        public LunchAppService() { }
        public LunchAppService(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public async Task<string> MakeRequestAsync(string url, string method, object dataToSend = null)
        {
            string data = null;
            HttpResponseMessage response = null;

            switch (method)
            {
                case "GET":
                    response = await client.GetAsync(url);
                    break;
                case "POST":
                    response = await client.PostAsync(url, new StringContent(dataToSend.ToString(), Encoding.UTF8, "application/json"));
                    break;
                case "PUT":
                    response = await client.PutAsync(url, new StringContent(dataToSend.ToString(), Encoding.UTF8, "application/json"));
                    break;
                case "DELETE":
                    response = await client.DeleteAsync(url);
                    break;
            }
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                data = responseContent;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized || response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                return "Unauthorized";
            }
            return data;
        }
    }
}
