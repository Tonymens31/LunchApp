using IdentityModel;
using Lunch_App.Data;
using Lunch_App.Services;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace Lunch_App
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            if (env.IsDevelopment())
            {
                // builder.AddApplicationInsightsSettings(developerMode: true);
            }

            ConfigurationRoot = builder.Build();

            Configuration = configuration;
        }

        static public IConfigurationRoot ConfigurationRoot { get; set; }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        [Obsolete]
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            var IDPSettings = new IDPSettings();
            Configuration.Bind("IDPSettings", IDPSettings);
            services.AddSingleton(IDPSettings);

            services.AddNodeServices();

            services.AddControllersWithViews().AddNewtonsoftJson();
            services.AddHttpContextAccessor();

            // --------- START SCRUM ------------------------------
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpClient<IAPIClient, APIClient>(options =>
            {
                options.BaseAddress = new Uri(IDPSettings.LunchAppUrl);
                options.DefaultRequestHeaders.Accept.Clear();
            });
            services.AddTransient<IAPIServices, APIServices>();
            // ---------- END SCRUM -------------------

            services.AddScoped<HCMAdminHTTPClient, HCMAdminHTTPClientIdentity>();
            services.AddScoped<IHelperInterface, ApiHelper>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            ConfigureIdentityServer(services);
        }

        private void ConfigureIdentityServer(IServiceCollection services)
        {

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie("Cookies")
            .AddOpenIdConnect("oidc", options =>
            {
                //options.SignInScheme = "Cookies";
                options.Authority = IDPSettings.Current.Authority;
                options.RequireHttpsMetadata = IDPSettings.Current.RequireHttpsMetadata;
                options.ClientId = IDPSettings.Current.ClientId;
                options.ClientSecret = IDPSettings.Current.Secret;
                options.ResponseType = "code";
                options.CallbackPath = new PathString("/Forward");
                //options.SignedOutCallbackPath = IDPSettings.Current.SignOutURL;
                options.SignedOutRedirectUri = IDPSettings.Current.SignOutURL;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.Scope.Add("openid");
                options.Scope.Add("email");
                options.Scope.Add("gatewayapi");
                options.Scope.Add("payrollapi");
                options.Scope.Add("profile");
                options.Scope.Add("hcmmanagerapi");
                options.Scope.Add("globalapi");
                options.Scope.Add("hrapi");
                options.SaveTokens = true;
                options.Events = new OpenIdConnectEvents
                {
                    OnRedirectToIdentityProvider = context =>
                    {
                        context.ProtocolMessage.SetParameter("acr_values", "53c5f3b6-f105-4720-829e-08ed84b75233");

                        return Task.FromResult(0);
                    }
                };
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = JwtClaimTypes.Name,
                    RoleClaimType = JwtClaimTypes.Role,
                };
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Dashboard}/{id?}");
            });
        }
    }
}
