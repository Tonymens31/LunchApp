using Lunch_App.ResponseModel;
using System.Net.Http;
using System.Threading.Tasks;

namespace Lunch_App.Services
{
    public interface HCMAdminHTTPClient
    {
        Task<string> GetTokenExtAsync();
        Task<string> SendDataToAPI(string URL, string method, bool token = true, object dataToSend = null);
        Task<ResponseListData<object>> GetRequestAsync(string endpoint, string token);
    }
}
