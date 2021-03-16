using System.Threading.Tasks;

namespace Lunch_App.HTTPServices
{
    public interface HelperInterface
    {
        Task<string> MakeRequestAsync(string url, string method, object dataToSend = null);
    }
}
