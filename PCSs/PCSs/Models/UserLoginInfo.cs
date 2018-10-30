using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PCSs.Models
{
    public enum UserRole
    {
        ADMIN = 0,
        CLIENT = 1,
        SPECIALIST = 2,
        CANDIDATE = 3,
    }
    public class UserLoginInfo
    {
        public string UserName { get; set; }
        public string  Password { get; set; }
        public string ReturnURL { get; set; }
        public bool  IsRemember { get; set; }
    }

    public class PasswordToChange
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
       
}