using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App.ResponseModel
{
    public class ResponseItem<TModel>
    {
        public string Status { get; set; }
        public string Caption { get; set; }
        public TModel Body { get; set; }
    }
}
