﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PCSs.Models
{
    public class SpecialistInfo
    {
        public class SpecialistSimpleInfo
        {
            public long SpecialistId { get; set; }
            public string FirstName { get; set; }
            public string MiddleName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string Role { get; set; }
            public string UserLoginId { get; set; }
           
        }
    }
}