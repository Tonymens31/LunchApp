using Lunch_App.ResponseModel;
using IdentityModel.Client;
using Marvin.StreamExtensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Lunch_App.Data;
using Lunch_App.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using RestSharp;
using Newtonsoft.Json;

namespace Lunch_App
{
    public class HCMAdminHTTPClientIdentity: HCMAdminHTTPClient
    {
        public IConfiguration Configuration { get; set; }
        private HttpClient _httpClient = new HttpClient();
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HCMAdminHTTPClientIdentity(IConfiguration configurations, IHttpContextAccessor httpContextAccessor)
        {
            Configuration = configurations;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetToken()
        {
            string accessToken = string.Empty;
            var currentContext = _httpContextAccessor.HttpContext;
            var expires_at = await currentContext.GetTokenAsync("expires_at");

           if (string.IsNullOrWhiteSpace(expires_at) || ((DateTime.Parse(expires_at).AddSeconds(-60)).ToUniversalTime() < DateTime.UtcNow))
                accessToken = await RenewTokens();
            else
                accessToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);

            return accessToken;
        }

        private async Task<string> RenewTokens()
        {
            try
            {
                var client = new HttpClient();

                var disco = await client.GetDiscoveryDocumentAsync(IDPSettings.Current.Authority);

                var currentContext = _httpContextAccessor.HttpContext;
                var discoveryClient = await client.GetDiscoveryDocumentAsync(IDPSettings.Current.Authority);
                //  var metaDataResponse = await discoveryClient.GetAsync(); -- old


                //-------------- new implementation
                var tokenClient = new TokenClient(client, 
                    new TokenClientOptions { 
                        Address = discoveryClient.TokenEndpoint,
                        ClientId = IDPSettings.Current.ClientId,
                        ClientSecret = IDPSettings.Current.Secret
                    });  
                //new TokenClient(discoveryClient.TokenEndpoint, IDSConstant.CustomerAdminClientId, IDSConstant.CustomerAdminClientSecret);

                var currentRefreshToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.RefreshToken);
                var tokenResult = await tokenClient.RequestRefreshTokenAsync(currentRefreshToken);

                if (!tokenResult.IsError)
                {
                    var authenticateInfo = await currentContext.AuthenticateAsync("Cookies");
                    var expiresAt = DateTime.UtcNow + TimeSpan.FromSeconds(tokenResult.ExpiresIn);

                    authenticateInfo.Properties.UpdateTokenValue("expires_at", expiresAt.ToString("o", CultureInfo.InvariantCulture));
                    authenticateInfo.Properties.UpdateTokenValue(OpenIdConnectParameterNames.AccessToken, tokenResult.AccessToken);
                    authenticateInfo.Properties.UpdateTokenValue(OpenIdConnectParameterNames.RefreshToken, tokenResult.RefreshToken);

                    await currentContext.SignInAsync("Cookies", authenticateInfo.Principal, authenticateInfo.Properties);

                    return tokenResult.AccessToken;
                }
                else throw new Exception("Problem encountered while refreshing tokens.", tokenResult.Exception);
            }
            catch(Exception ex)
            {
                return "";
                throw ex;
            }
            
        }

        public async Task<string> SendDataToAPI(string URL, string method, bool token = true, object dataToSend = null)
        {
            var client = new RestClient(URL);
            client.Timeout = -1;

            var request = new RestRequest(); 
            switch (method.ToUpper())
            {
                case "GET":
                    request.Method = Method.GET;
                    break;
                case "POST":
                    request.Method = Method.POST;
                    break;
                case "PUT":
                    request.Method = Method.PUT;
                    break;
                case "DELETE":
                    request.Method = Method.DELETE;
                    break;
            }

            if (token == true)
            {
                var newToken = await GetTokenExtAsync();
                request.AddParameter("Authorization", $"Bearer {newToken}", ParameterType.HttpHeader);
            }

            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json", JsonConvert.SerializeObject(dataToSend), ParameterType.RequestBody);

            var response = await client.ExecuteAsync(request);

            return JsonConvert.SerializeObject(new { Status = response.StatusCode, Caption = response.StatusDescription, Body = response.Content, Header = response.Headers });
        }

        public async Task<string> GetTokenExtAsync()
        {
            return await GetToken();
        }

        public Task<ResponseListData<object>> GetRequestAsync(string endpoint, string token)
        {
            throw new NotImplementedException();
        }
    }
}
