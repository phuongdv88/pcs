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
    
    public partial class CompanyInfo
    {
        public long CompanyInfoId { get; set; }
        public System.DateTime StartDate { get; set; }
        public System.DateTime StopDate { get; set; }
        public string Jobtitle { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
        public string Note { get; set; }
        public string CheckingStatus { get; set; }
        public long CandidateId { get; set; }
        public Nullable<System.DateTime> CheckingTime { get; set; }
        public bool IsChecked { get; set; }
        public string JobDuties { get; set; }
        public string CheckResult { get; set; }
    }
}
