//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PCSs.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserLogin
    {
        public long UserLoginId { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public int Role { get; set; }
        public int AccessFailedCount { get; set; }
        public bool LockoutEnabled { get; set; }
        public Nullable<System.DateTime> LockoutDateUtc { get; set; }
        public string PasswordRaw { get; set; }
    }
}
