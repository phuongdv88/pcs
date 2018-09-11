using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PCSs.Models
{
    public class UserLoginInfo
    {
        public string UserName { get; set; }
        public string  Password { get; set; }
        public string ReturnURL { get; set; }
        public bool  IsRemember { get; set; }
    }
}