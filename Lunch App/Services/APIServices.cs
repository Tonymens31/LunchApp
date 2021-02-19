using Lunch_App.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Lunch_App.Services
{
    public interface IAPIServices
    {
        Task<ResponseData<TModel>> PostAsync<TModel>(string endPoint, object data);

        Task<ResponseData<TModel>> PutAsync<TModel>(string endPoint, object data);

        Task<ResponseData<TModel>> DelAsync<TModel>(string endPoint, object data);

        Task<ResponseData<TModel>> GetAsync<TModel>(string endPoint, bool onlyFirst = false);
    }

    public class APIServices: IAPIServices
    {
        public readonly IAPIClient _client;
        private readonly static string StatusSuccessful = "Success";
        private readonly static string StatusFailure = "Fail";

        protected readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public APIServices(IAPIClient client)
        {
            _client = client;
        }

        public async Task<ResponseData<TModel>> PostAsync<TModel>(string endPoint, object data)
        {
            try
            {
                var client = await _client.GetClientAsync();
                var request = new HttpRequestMessage(HttpMethod.Post, endPoint);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(JsonConvert.SerializeObject(data));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token);
                var content = await response.Content.ReadAsStringAsync();
                return new ResponseData<TModel>()
                {
                    Code = (int)response.StatusCode,
                    Status = response.IsSuccessStatusCode ? StatusSuccessful : "Fail",
                    Caption = response.ReasonPhrase.ToString(),
                    Body = response.IsSuccessStatusCode ? JsonConvert.DeserializeObject<TModel>(content) : default
                };
            }
            catch (Exception ex)
            {
                return new ResponseData<TModel>()
                {
                    Code = 408,
                    Status = "Fail",
                    Caption = ex.Message,
                    Body = default
                };
            }
        }

        public async Task<ResponseData<TModel>> PutAsync<TModel>(string endPoint, object data)
        {
            try
            {
                var client = await _client.GetClientAsync();
                var request = new HttpRequestMessage(HttpMethod.Put, endPoint);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(JsonConvert.SerializeObject(data));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token);
                return new ResponseData<TModel>()
                {
                    Code = (int)response.StatusCode,
                    Status = response.IsSuccessStatusCode ? StatusSuccessful : StatusFailure,
                    Caption = response.ReasonPhrase.ToString(),
                    Body = response.IsSuccessStatusCode ? JsonConvert.DeserializeObject<TModel>(await response.Content.ReadAsStringAsync()) : default
                };
            }
            catch (Exception ex)
            {
                return new ResponseData<TModel>()
                {
                    Code = 408,
                    Status = StatusFailure,
                    Caption = ex.Message,
                    Body = default
                };
            }
        }

        public async Task<ResponseData<TModel>> DelAsync<TModel>(string endPoint, object data)
        {
            try
            {
                var client = await _client.GetClientAsync();
                var request = new HttpRequestMessage(HttpMethod.Delete, endPoint);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(JsonConvert.SerializeObject(data));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token);
                return new ResponseData<TModel>()
                {
                    Code = (int)response.StatusCode,
                    Status = response.IsSuccessStatusCode ? StatusSuccessful : StatusFailure,
                    Caption = response.ReasonPhrase.ToString(),
                    Body = response.IsSuccessStatusCode ? JsonConvert.DeserializeObject<TModel>(await response.Content.ReadAsStringAsync()) : default
                };
            }
            catch (Exception ex)
            {
                return new ResponseData<TModel>()
                {
                    Code = 408,
                    Status = StatusFailure,
                    Caption = ex.Message,
                    Body = default
                };
            }
        }

        public async Task<ResponseData<TModel>> GetAsync<TModel>(string endPoint, bool onlyFirst = false)
        {
            try
            {
                var client = await _client.GetClientAsync();
                var request = new HttpRequestMessage(HttpMethod.Get, endPoint);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));

                using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token);
                return new ResponseData<TModel>()
                {
                    Code = (int)response.StatusCode,
                    Status = response.IsSuccessStatusCode ? StatusSuccessful : StatusFailure,
                    Caption = response.ReasonPhrase.ToString(),
                    Body = response.IsSuccessStatusCode
                        ? onlyFirst
                        ? JsonConvert.DeserializeObject<IEnumerable<TModel>>(await response.Content.ReadAsStringAsync()).FirstOrDefault()
                        : JsonConvert.DeserializeObject<TModel>(await response.Content.ReadAsStringAsync())
                        : default
                };
            }
            catch (Exception ex)
            {
                return new ResponseData<TModel>()
                {
                    Code = 408,
                    Status = StatusFailure,
                    Caption = ex.Message,
                    Body = default
                };
            }
        }

    }
}
