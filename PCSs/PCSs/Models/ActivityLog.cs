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
    
    public partial class ActivityLog
    {
        public long ActivityLogId { get; set; }
        public string ActionType { get; set; }
        public Nullable<System.DateTime> ActionTime { get; set; }
        public string ActionContent { get; set; }
        public Nullable<long> UserLoginId { get; set; }
        public Nullable<int> UserRole { get; set; }
        public Nullable<long> SpecialistId { get; set; }
        public Nullable<long> CandidateId { get; set; }
    }
}
