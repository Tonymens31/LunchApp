using IdentityModel.Client;
using Lunch_App.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System;
using System.Globalization;
using System.Net.Http;
using System.Threading.Tasks;

namespace Lunch_App.Services
{
    public interface IAPIClient
    {
        Task<HttpClient> GetClientAsync();
    }

    public class APIClient : IAPIClient
    {
        public readonly HttpClient Client;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public APIClient(HttpClient client, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            Client = client;
        }

        public async Task<HttpClient> GetClientAsync()
        {
            var currentContext = _httpContextAccessor.HttpContext;
            /*
            string accessToken;
            var expires_at = await currentContext.GetTokenAsync("expires_at");
            if (string.IsNullOrWhiteSpace(expires_at) || ((DateTime.Parse(expires_at).AddSeconds(-60)).ToUniversalTime() < DateTime.UtcNow))
            { 
                accessToken = await RenewTokens();
            }
            else
            { 
                accessToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
            }
            */
            var accessToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
            if (!string.IsNullOrWhiteSpace(accessToken))
            {
                Client.SetBearerToken(accessToken);
            }
            return Client;
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
                    new TokenClientOptions
                    {
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
            catch (Exception ex)
            {
                return "";
                throw ex;
            }

        }

    }
}
