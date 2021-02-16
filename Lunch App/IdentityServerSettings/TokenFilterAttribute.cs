using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Lunch_App.Data;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;

namespace Lunch_App
{
    public class TokenFilterAttribute : ActionFilterAttribute
    {
        public override async void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var expat = await filterContext.HttpContext.GetTokenAsync("expires_at");

            var dataExp = DateTime.Parse(expat, null, DateTimeStyles.RoundtripKind);

            if ((dataExp - DateTime.Now).TotalMinutes < 10)
            {
                var disco = new HttpClient();

                var client = await disco.GetDiscoveryDocumentAsync(IDPSettings.Current.Authority); 
                client.Policy.RequireHttps = IDPSettings.Current.RequireHttpsMetadata;

                if (client.IsError) throw new Exception(client.Error); 

                var tokenClient = new TokenClient(disco,
                    new TokenClientOptions
                    {
                        Address = client.TokenEndpoint,
                        ClientId = IDPSettings.Current.ClientId,
                        ClientSecret = IDPSettings.Current.Secret
                    });  

                var rt = await filterContext.HttpContext.GetTokenAsync("refresh_token");
                var tokenResult = await tokenClient.RequestRefreshTokenAsync(rt);

                if (!tokenResult.IsError)
                {
                    var oldIdToken = await filterContext.HttpContext.GetTokenAsync("id_token");
                    var newAccessToken = tokenResult.AccessToken;
                    var newRefreshToken = tokenResult.RefreshToken;

                    var tokens = new List<AuthenticationToken>
                    {
                        new AuthenticationToken {Name = OpenIdConnectParameterNames.IdToken, Value = oldIdToken},
                        new AuthenticationToken
                        {
                            Name = OpenIdConnectParameterNames.AccessToken,
                            Value = newAccessToken
                        },
                        new AuthenticationToken
                        {
                            Name = OpenIdConnectParameterNames.RefreshToken,
                            Value = newRefreshToken
                        }
                    };

                    var expiresAt = DateTime.Now + TimeSpan.FromSeconds(tokenResult.ExpiresIn);
                    tokens.Add(new AuthenticationToken
                    {
                        Name = "expires_at",
                        Value = expiresAt.ToString("o", CultureInfo.InvariantCulture)
                    });

                    var info = await filterContext.HttpContext.AuthenticateAsync("Cookies");
                    info.Properties.StoreTokens(tokens);
                    await filterContext.HttpContext.SignInAsync("Cookies", info.Principal, info.Properties);
                }
            }
        }
    }
}
