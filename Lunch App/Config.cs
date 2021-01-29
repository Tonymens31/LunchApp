using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lunch_App
{
    public class Config
    {
        public static Config Current;
        public Config()
        {
            Current = this;
        }

        public string LunchAppUrl { get; set; }

    }
}
