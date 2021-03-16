using System.Collections.Generic;

namespace Lunch_App.ResponseModel
{
    public class ResponseListData<TModel>
    {
        public string Status { get; set; }
        public string Caption { get; set; }
        public IEnumerable<TModel> Body { get; set; }
    }
}
