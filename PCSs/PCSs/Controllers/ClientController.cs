using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PCSs.Models;
using System.Data.Entity.Migrations;
using System.IO;
using System.Net.Mime;

namespace PCSs.Controllers
{
    [ClientAuthorization]
    public class ClientController : Controller
    {
        private PCSEntities db = new PCSEntities();
        // GET: Client Manager
        public ActionResult ManageAccount(long? id)
        {
            if(id == null)
            {
                return RedirectToAction("Error", "Error");
            }
            ViewBag.RecruiterId = id;
            var recruiter = db.Recruiters.FirstOrDefault(s => s.RecruiterId == id);
            if (recruiter != null)
            {
                if(recruiter.MiddleName == null){
                    ViewBag.Title = recruiter.FirstName + " " + recruiter.LastName;
                } else
                {
                    ViewBag.Title = recruiter.FirstName + " " + recruiter.MiddleName + " " + recruiter.LastName;

                }
            }
            return View();
        }
        /// <summary>
        /// Get all Candidate
        /// </summary>
        /// <returns></returns>

        public JsonResult GetAllCandidate(long id)
        {
            //if (recruiterId == null)
            //    return Json(new { msg = "Can't find user id" }, JsonRequestBehavior.AllowGet);
            var result = Json(db.Candidates.Where(s => s.RecruiterId == id).OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult GetAllCandidateCompleted(long id)
        {
            //if (recruiterId == null)
            //    return Json(new { msg = "Can't find user id" }, JsonRequestBehavior.AllowGet);
            var result = Json(db.Candidates.Where(s => s.RecruiterId == id && (s.Status == "Completed" || s.Status == "Closed")).OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            return result;
        }

        public JsonResult GetCandidateReport(long id)
        {
            // return link file of Candidate report
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { rs = -1, msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
            }
            var candidate = db.Candidates.First(s => s.CandidateId == id && s.RecruiterId == recruitID);
            if (candidate == null)
            {
                return Json(new { rs = -1, msg = "Error: You don't have permittion to view this candidate report" }, JsonRequestBehavior.AllowGet);
            }
            var attachment = db.AttachmentFiles.LastOrDefault(s => s.CandidateId == id);
            if(attachment != null)
            {
                return Json(new { rs = 1, link = attachment.Link }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { rs = -1, msg = "Error: Can't find this candidate report" }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetCandidateReportPdf(long id)
        {
            // return link file of Candidate report
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return RedirectToAction("ErrorDontHavePermission", "Error");
            }
            var candidate = db.Candidates.FirstOrDefault(s => (s.CandidateId == id && s.RecruiterId == recruitID));
            if (candidate == null)
            {
                return RedirectToAction("ErrorDontHavePermission", "Error");
            }
            try
            {
                var attachment = db.AttachmentFiles.Where(s => s.CandidateId == id).OrderByDescending(s=>s.AttachmentFileId).Take(1).Single();
                if (attachment != null)
                {
                    byte[] filedata = System.IO.File.ReadAllBytes(attachment.Link);
                    string contentType = MimeMapping.GetMimeMapping(attachment.Link);

                    var cd = new System.Net.Mime.ContentDisposition
                    {
                        FileName = attachment.FileName,
                        Inline = true,
                    };

                    Response.AppendHeader("Content-Disposition", cd.ToString());

                    return File(filedata, contentType);
                }

                return RedirectToAction("Error", "Error");

            }
            catch (Exception e)
            {
                return RedirectToAction("Error", "Error");
            }
        }
        public JsonResult GetCandidate(long id)
        {
            var can = db.Candidates.FirstOrDefault(x => x.CandidateId == id);
            return Json(can, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCandidateInfo(long id)
        {
            var user = db.UserLogins.FirstOrDefault(x => x.UserLoginId == id);
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateCandidate(CandidateSimpleInfo can)
        {
            try
            {
                var userLogin = new UserLogin()
                {
                    UserName = Util.Helper.getRandomAlphaNumeric(6).ToUpper(),
                    PasswordRaw = Util.Helper.getRandomAlphaNumeric(8),
                    SecurityStamp = Util.Helper.getRandomAlphaNumeric(100),
                    Role = (int)UserRole.CANDIDATE,
                    AccessFailedCount = 0,
                    LockoutEnabled = true,
                    LockoutDateUtc = DateTime.UtcNow.AddDays(7)
                };// create user name pass word
                while (db.UserLogins.Any(s => s.UserName == userLogin.UserName))
                {
                    userLogin.UserName = Util.Helper.getRandomAlphaNumeric(6).ToUpper();
                }
                userLogin.PasswordHash = Util.Helper.createMD5Hash(userLogin.PasswordRaw, userLogin.UserName, userLogin.SecurityStamp);

                db.UserLogins.Add(userLogin);
                db.SaveChanges();

                // create candidate
                var candidate = new Candidate()
                {
                    UserLoginId = userLogin.UserLoginId,
                    FirstName = can.FirstName,
                    MiddleName = can.MiddleName,
                    LastName = can.LastName,
                    Email = can.Email,
                    PhoneNumber = can.PhoneNumber,
                    JobTitle = can.JobTitle,
                    JobLevel = can.JobLevel,
                    RecruiterId = can.CurrentRecruiterId,
                    CreatedTime = DateTime.Now,
                    Status = "Initial",
                    CompleteTime = DateTime.Now,
                    SpecialistId = -1,

                };
                db.Candidates.Add(candidate);
                var rs = db.SaveChanges();
                return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateCandidate(CandidateSimpleInfo can)
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
            }
            var candidate = db.Candidates.First(s => s.CandidateId == can.CandidateId && s.RecruiterId == recruitID);
            if (candidate == null)
            {
                return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
            }
            if(candidate.Status != "Initial")
            {
                return Json(new { msg = "Error: Can not edit candidate information when they submited" }, JsonRequestBehavior.AllowGet);
            }
            candidate.FirstName = can.FirstName;
            candidate.MiddleName = can.MiddleName;
            candidate.LastName = can.LastName;
            candidate.Email = can.Email;
            candidate.PhoneNumber = can.PhoneNumber;
            candidate.JobTitle = can.JobTitle;
            candidate.JobLevel = can.JobLevel;
            db.Entry(candidate).State = EntityState.Modified;
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCandidate(long id)
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
            }
            var candidate = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.RecruiterId == recruitID);
            if (candidate == null)
            {
                return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
            }
            if (candidate.Status != "Initial")
            {
                return Json(new { msg = "Error: Can not edit candidate information when they submited" }, JsonRequestBehavior.AllowGet);
            }

            db.Candidates.Remove(candidate);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetRecruiterProfile()
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { msg = "Error: Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
            }
            var recruiter = db.Recruiters.FirstOrDefault(x => x.RecruiterId == recruitID);
            return Json(recruiter, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReportForChart()
        {
            long recruitID = -1;
            try {
                if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
                {
                    return Json(new { msg = "Error: Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
                }
                string registered = "";
                string completed = "";
                // get register by month
                for (int i = 1; i <= 12; i++)
                {
                    registered += db.Candidates.Count(s => (s.RecruiterId == recruitID && s.CreatedTime.Month == i)).ToString() + ',';
                    completed += db.Candidates.Count(s => (s.RecruiterId == recruitID && (s.CompleteTime != null && s.CompleteTime.Value.Month == i) && (s.Status == "Completed" || s.Status == "Closed"))).ToString() + ',';
                }
                if (registered.Length > 0)
                {
                    registered = registered.Substring(0, registered.Length - 1);
                    completed = completed.Substring(0, completed.Length - 1);
                }
                var rs = new { RegisterArray = registered, CompleteArray = completed };
                return Json(rs, JsonRequestBehavior.AllowGet);
            }catch(Exception e)
            {
                return Json(e.Message, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateRecruiterProfile(Recruiter newRecruiter)
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { rs = -1, msg = "Error: Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
            }
            var recruiter = db.Recruiters.FirstOrDefault(x => x.RecruiterId == recruitID);
            if (recruiter != null)
            {
                if (recruiter.FirstName != newRecruiter.FirstName ||
                recruiter.MiddleName != newRecruiter.MiddleName ||
                recruiter.LastName != newRecruiter.LastName ||
                recruiter.Email != newRecruiter.Email ||
                recruiter.PhoneNumber != newRecruiter.PhoneNumber)
                {
                    recruiter.FirstName = newRecruiter.FirstName;
                    recruiter.MiddleName = newRecruiter.MiddleName;
                    recruiter.LastName = newRecruiter.LastName;
                    recruiter.Email = newRecruiter.Email;
                    recruiter.PhoneNumber = newRecruiter.PhoneNumber;
                    db.Entry(recruiter).State = EntityState.Modified;
                    var r = db.SaveChanges();
                    var recruiterName = recruiter.FirstName + " " + recruiter.LastName;
                    if(recruiter.MiddleName != null)
                    {
                        recruiterName = recruiter.FirstName + " " + recruiter.MiddleName + " " + recruiter.LastName;
                    } 
                    return Json(new { rs = r, msg = recruiterName }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { rs = -1, msg = "1" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdatePassword(PasswordToChange passwordTochange)
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { result = -1, msg = "Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
            }
            var recruiter = db.Recruiters.FirstOrDefault(x => x.RecruiterId == recruitID);
            if (recruiter != null)
            {
                var userLogin = db.UserLogins.FirstOrDefault(x => x.UserLoginId == recruiter.UserLoginId);
                if(userLogin != null)
                {
                    // check old password
                    bool isMatch = PCSs.Util.Helper.CompareMD5HashValue(passwordTochange.OldPassword, userLogin.UserName, userLogin.SecurityStamp, userLogin.PasswordHash);
                    if (isMatch)
                    {
                        //updatePassword 
                        if(passwordTochange.NewPassword.Length == 0)
                        {
                            return Json(new { result = -1, msg = "New password is empty." }, JsonRequestBehavior.AllowGet);
                        }
                        userLogin.SecurityStamp = Util.Helper.getRandomAlphaNumeric(100);
                        userLogin.PasswordHash = Util.Helper.createMD5Hash(passwordTochange.NewPassword, userLogin.UserName, userLogin.SecurityStamp);
                        db.Entry(userLogin).State = EntityState.Modified;
                        var rs = db.SaveChanges();
                        return Json(new { result = rs, msg = "Update password successfully." }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { result = -1, msg = "Old password is incorrect." }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(new { result = -1, msg = "Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
        }
   
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
