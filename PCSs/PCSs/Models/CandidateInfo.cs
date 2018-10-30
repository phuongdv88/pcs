using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs.Models
{
    enum JobLevel
    {
        Fresher,
        Junior,
        Senior,
        Manager,
        Higher
    }

    enum CandidateStatus
    {
        Initial,
        Ready,
        Processing,
        MissingInformation,
        Pending,
        Completed,
        Closed,
    }
    public class CandidateSimpleInfo
    {
        public long CandidateId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string JobTitle { get; set; }
        public string JobLevel { get; set; }
        public string RecruiterId { get; set; }
        public long CurrentRecruiterId { get; set; }
    }

    public class CandidateStatusToChange
    {
        public long CandidateId { get; set; }
        public string CandidateStatus { get; set; }
    }
}