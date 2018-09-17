using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs.Models
{
    public class CandidateInfo
    {
        public Candidate CandidateGeneralInfo { get; set; }
        public Dictionary<CompanyInfo, ReferenceInfo> ChecksInfo { get; set; }

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
                    // get checks info
                    if(CandidateGeneralInfo != null)
                    {
                        List<CompanyInfo> coms = db.CompanyInfoes.Where(s => s.CandidateId == CandidateGeneralInfo.CandidateId).ToList();
                        if(coms != null)
                        {
                            foreach(var com in coms)
                            {
                                List<ReferenceInfo> refers = db.ReferenceInfoes.Where(s => s.CompanyInfoId == com.CompanyInfoId).ToList();
                                if(refers == null)
                                {
                                    ChecksInfo.Add(com, null);
                                } else
                                {
                                    foreach(var refer in refers)
                                    {
                                        ChecksInfo.Add(com, refer);
                                    }
                                }
                            }
                        }

                    }

                }
            }
            catch
            {

                throw;
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