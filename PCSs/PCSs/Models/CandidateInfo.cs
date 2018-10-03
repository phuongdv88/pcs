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
        Finish
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
    public class CandidateInfo
    {
        public Candidate CandidateGeneralInfo { get; set; }
        public Dictionary<CompanyInfo, ReferencesInformation> ChecksInfo { get; set; }
        public int NumberOfCompany { get; set; }

        public bool IsAccepted { get; set; }

        public CandidateInfo()
        {

        }
        // generate CandidateInfo by candidateId
        public CandidateInfo(long? userLoginId)
        {
            try
            {
                using(var db = new PCSEntities())
                {
                    CandidateGeneralInfo = db.Candidates.FirstOrDefault(s => s.UserLoginId == userLoginId);
                    ChecksInfo = new Dictionary<CompanyInfo, ReferencesInformation>();
                    // get checks info
                    if(CandidateGeneralInfo != null)
                    {
                        List<CompanyInfo> coms = db.CompanyInfoes.Where(s => s.CandidateId == CandidateGeneralInfo.CandidateId).ToList();
                        if(coms != null)
                        {
                            foreach(var com in coms)
                            {
                                var refer = new ReferencesInformation(com.CompanyInfoId);
                                ChecksInfo.Add(com, refer);
                            }
                        }
                        NumberOfCompany = ChecksInfo.Count;

                    }

                }
            }
            catch(Exception e)
            {
                // log error
                int i = 0;

            }
        }

        public void Create(CandidateInfo canInfo)
        {
            if(canInfo!= null)
            {
                try
                {
                    using (var db = new PCSEntities())
                    {
                        if (canInfo.CandidateGeneralInfo != null)
                        {
                            db.Candidates.Add(canInfo.CandidateGeneralInfo);
                            db.SaveChanges();
                        }
                    }

                }
                catch (Exception e)
                {

                    throw e;
                }
            }
        }

        public void Update(CandidateInfo canInfo)
        {
            // updaet can, companyinfo, reference info
            if (canInfo != null)
            {
                try
                {
                    using (var db = new PCSEntities())
                    {
                        if (canInfo.CandidateGeneralInfo != null)
                        {
                            //db.Candidates.AddOrUpdate(canInfo.CandidateGeneralInfo);
                            //db.SaveChanges();
                            db.Candidates.Add(canInfo.CandidateGeneralInfo);
                            db.Entry(canInfo.CandidateGeneralInfo).State = System.Data.Entity.EntityState.Modified;
                            db.SaveChanges();
                        }
                    }

                }
                catch (Exception e)
                {

                    throw e;
                }
            }
        }
    }
}