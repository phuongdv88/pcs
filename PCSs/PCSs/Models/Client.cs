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
    
    public partial class Client
    {
        public long ClientId { get; set; }
        public string Name { get; set; }
        public string TaxCode { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
        public string Description { get; set; }
        public System.DateTime StartDate { get; set; }
        public System.DateTime StopDate { get; set; }
        public int PackageValue { get; set; }
    }
}
