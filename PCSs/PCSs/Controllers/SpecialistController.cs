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
using System.IO;

namespace PCSs.Controllers
{
    [SpecialistAuthorization]
    public class SpecialistController : Controller
    {
        private PCSEntities db = new PCSEntities();

        // Get: Specialist
        public ActionResult ProcessBackgroundCheckCandidate(long? id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                ViewBag.CandidateId = id;
                var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == specialistId);
                if (specialist != null)
                {
                    if (specialist.MiddleName == null)
                    {
                        ViewBag.SpecialistName = specialist.FirstName + " " + specialist.LastName;
                    }
                    else
                    {
                        ViewBag.SpecialistName = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName;
                    }
                }
                return View();

            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }


        public ActionResult ManageSpecialistAccount(long? id)
        {
            if (id == null)
            {
                return RedirectToAction("Error", "Error");
            }
            if (Session["Role"] == null || Session["Role"]?.ToString() != "2")
                return RedirectToAction("Error", "Error");

            @ViewBag.SpecialistId = id;
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == id);
            if (specialist != null)
            {
                if (specialist.MiddleName == null)
                {
                    ViewBag.SpecialistName = specialist.FirstName + " " + specialist.LastName;
                }
                else
                {
                    ViewBag.SpecialistName = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName;
                }
            }
            return View();
        }

        public JsonResult GetAllReference(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                return Json(db.ReferenceInfoes.Where(s => s.CompanyInfoId == id).OrderBy(s => s.ReferenceInfoId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetAvailableCandidate()
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var result = Json(db.Candidates.Where(s => ((s.Status == "Initial" || s.Status == "Ready") && s.SpecialistId == -1)).OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
                //todo:fortest
                //var result = Json(db.Candidates.OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
                return result;

            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetMyCandidate()
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var cans = (from can in db.Candidates
                           join client in db.Clients
                           on can.ClientId equals client.ClientId
                           where can.SpecialistId == specialistId
                           select new {
                               ClientName = client.Name,
                               can.CandidateId,
                               can.FirstName,
                               can.MiddleName,
                               can.LastName,
                               can.Email,
                               can.PhoneNumber,
                               can.Status,
                               can.CreatedTime,
                               can.CompleteTime,
                           }).OrderByDescending(s=>s.CandidateId);
                return Json(cans, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AssignMe(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Can not get candiate's profile" }, JsonRequestBehavior.AllowGet);
                }
                if (can.SpecialistId == -1)
                {
                    can.SpecialistId = specialistId;
                    db.Entry(can).State = EntityState.Modified;
                    var r = db.SaveChanges();

                    return Json(new { rs = 1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { rs = -1, msg = "Can not assign this candiate" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetCandidate(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }
                var can = db.Candidates.FirstOrDefault(x => x.CandidateId == id);
                return Json(can, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCandidateInfo(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Can not get candiate's profile" }, JsonRequestBehavior.AllowGet);
                }
                var user = db.UserLogins.FirstOrDefault(x => x.UserLoginId == can.UserLoginId);
                return Json(user, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetSpecialistProfile()
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            var specialist = db.Specialists.FirstOrDefault(x => x.SpecialistId == specialistId);
            return Json(specialist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReportForChart()
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            string registered = "";
            string completed = "";
            // get register by month
            for (int i = 1; i <= 12; i++)
            {
                registered += db.Candidates.Count(s => (s.SpecialistId == specialistId && s.CreatedTime.Month == i)).ToString() + ',';
                completed += db.Candidates.Count(s => (s.SpecialistId == specialistId && s.CompleteTime != null && s.CompleteTime.Value.Month == i && (s.Status == "Completed" || s.Status == "Closed"))).ToString() + ',';
            }
            registered = registered.Substring(0, registered.Length - 1);
            completed = completed.Substring(0, completed.Length - 1);
            var rs = new { RegisterArray = registered, CompleteArray = completed };
            return Json(rs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateSpecialistProfile(Specialist newSpecialist)
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            var specialist = db.Specialists.FirstOrDefault(x => x.SpecialistId == specialistId);
            if (specialist != null)
            {
                if (specialist.FirstName != newSpecialist.FirstName ||
                specialist.MiddleName != newSpecialist.MiddleName ||
                specialist.LastName != newSpecialist.LastName ||
                specialist.Email != newSpecialist.Email ||
                specialist.PhoneNumber != newSpecialist.PhoneNumber)
                {
                    specialist.FirstName = newSpecialist.FirstName;
                    specialist.MiddleName = newSpecialist.MiddleName;
                    specialist.LastName = newSpecialist.LastName;
                    specialist.Email = newSpecialist.Email;
                    specialist.PhoneNumber = newSpecialist.PhoneNumber;
                    db.Entry(specialist).State = EntityState.Modified;
                    var r = db.SaveChanges();
                    var specialistName = specialist.FirstName + " " + specialist.LastName;
                    if (specialist.MiddleName != null)
                    {
                        specialistName = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName;
                    }
                    return Json(new { rs = r, msg = specialistName }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { rs = -1, msg = "1" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateCandidateStatus(CandidateStatusToChange status)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == status.CandidateId);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Can not get candiate's profile" }, JsonRequestBehavior.AllowGet);
                }
                if (can.Status != status.CandidateStatus)
                {
                    if(status.CandidateStatus == "Completed" || status.CandidateStatus == "Close")
                    {
                        can.CheckResult = "True";
                        can.CompleteTime = DateTime.Now;
                        var coms = db.CompanyInfoes.Where(s => s.CandidateId == can.CandidateId);
                        foreach(var com in coms)
                        {
                            if(com.IsChecked == false)
                            {
                                return Json(new { rs = -1, msg = "Candidate has not been checked all companies." }, JsonRequestBehavior.AllowGet);
                            }
                            if (com.CheckResult.Contains("False"))
                            {
                                can.CheckResult = "False";
                            }
                        }
                    }
                    can.Status = status.CandidateStatus;
                    can.LastUpdateReportTime = DateTime.Now;
                    db.Entry(can).State = EntityState.Modified;
                    db.SaveChanges();
                    var logAction = new ActivityLog()
                    {
                        ActionTime = DateTime.Now,
                        ActionType = "Update Candidate's Status",
                        ActionContent = "Change to " + status.CandidateStatus,
                        CandidateId = status.CandidateId,
                        SpecialistId = specialistId,
                    };
                    db.ActivityLogs.Add(logAction);

                    var r = db.SaveChanges();


                    return Json(new { rs = r, msg = "Done" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { rs = 1, msg = "unchange" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult LogActivity(ActivityLog logAcivity)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == logAcivity.CandidateId && s.SpecialistId == specialistId);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Can not get candiate's profile" }, JsonRequestBehavior.AllowGet);
                }
                // log activity
                logAcivity.ActionTime = DateTime.Now;
                logAcivity.SpecialistId = specialistId;
                logAcivity.UserRole = 2;
                db.ActivityLogs.Add(logAcivity);
                var r = db.SaveChanges();
                return Json(new { rs = r, msg = "Done" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetLogActivities(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }

                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.SpecialistId == specialistId);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Can not get candiate's profile" }, JsonRequestBehavior.AllowGet);
                }
                return Json(db.ActivityLogs.Where(s => (s.SpecialistId == specialistId) && s.CandidateId == id).OrderByDescending(s => s.ActivityLogId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateCompanyChecksResult(CompanyInfo com)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }
                var comInfo = db.CompanyInfoes.FirstOrDefault(s => s.CompanyInfoId == com.CompanyInfoId);
                if(comInfo != null)
                {
                    if(db.Candidates.Count(s=>s.CandidateId == com.CandidateId && s.SpecialistId == specialistId) > 0)
                    {
                        comInfo.CheckResult = com.CheckResult;
                        comInfo.CheckingTime = DateTime.Now;
                        comInfo.Note = com.Note;
                        comInfo.IsChecked = true;
                        var r = db.SaveChanges();

                        var logAction = new ActivityLog()
                        {
                            ActionTime = DateTime.Now,
                            ActionType = "Update Company Checks Result",
                            ActionContent = "Company Name: " + comInfo.Name + "; Result = " + com.CheckResult + "; Note:" + com.Note,
                            CandidateId = com.CandidateId,
                            SpecialistId = specialistId,
                        };
                        db.ActivityLogs.Add(logAction);
                        db.SaveChanges();
                        return Json(new { rs = r, msg = "Done" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { rs = -1, msg = "Save Fail" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdatePassword(PasswordToChange passwordTochange)
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { result = -1, msg = "Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            var specialist = db.Specialists.FirstOrDefault(x => x.SpecialistId == specialistId);
            if (specialist != null)
            {
                var userLogin = db.UserLogins.FirstOrDefault(x => x.UserLoginId == specialist.UserLoginId);
                if (userLogin != null)
                {
                    // check old password
                    bool isMatch = PCSs.Util.Helper.CompareMD5HashValue(passwordTochange.OldPassword, userLogin.UserName, userLogin.SecurityStamp, userLogin.PasswordHash);
                    if (isMatch)
                    {
                        //updatePassword 
                        if (passwordTochange.NewPassword.Length == 0)
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
            return Json(new { result = -1, msg = "Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UploadReport(long id)
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { result = -1, msg = "Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }

            var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.SpecialistId == specialistId);
            if (can != null)
            {
                try
                {
                    //upload file and save link to candidate by id
                    HttpPostedFileBase file = Request.Files[0]; //Uploaded file
                    // Create directory to save this file
                    string filePath = Util.Helper.getRandomAlphaNumeric(10);
                    while (Directory.Exists(Server.MapPath("~/Reports/") + filePath))
                    {
                        filePath = Util.Helper.getRandomAlphaNumeric(10);
                    }
                    Directory.CreateDirectory(Server.MapPath("~/Reports/") + filePath);
                    filePath += "/" + file.FileName; ;
                    //To save file, use SaveAs method
                    file.SaveAs(Server.MapPath("~/Reports/") + filePath);
                    AttachmentFile attachment = new AttachmentFile() { Link = Server.MapPath("~/Reports/") + filePath, CandidateId = id, FileName = file.FileName };
                    db.AttachmentFiles.Add(attachment);
                    db.SaveChanges();
                    var logAction = new ActivityLog()
                    {
                        ActionTime = DateTime.Now,
                        ActionType = "Upload Candidate's report",
                        ActionContent = "Upload " + can.FirstName + " " + can.MiddleName + " " + can.LastName + "'s report",
                        CandidateId = can.CandidateId,
                        SpecialistId = specialistId,
                    };
                    db.ActivityLogs.Add(logAction);
                    db.SaveChanges();

                    return Json(new { result = 1, msg = "Uploaded " + Request.Files.Count + " files" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new { result = -1, msg = "Can't get candidate's information" }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAllCompanyInfo(long? id)
        {
            if (id == null)
            {
                return Json(new { rs = -1, msg = "Error" }, JsonRequestBehavior.AllowGet);
            }
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }
                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.SpecialistId == specialistId);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
                }

                return Json(db.CompanyInfoes.Where(s => (s.CandidateId == id)).OrderBy(s => s.CompanyInfoId), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetCandidateById(long? id)
        {
            if (id == null)
            {
                return Json(new { rs = -1, msg = "Error" }, JsonRequestBehavior.AllowGet);
            }
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return Json(new { rs = -1, msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
                }
                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.SpecialistId == specialistId);
                if (can == null)
                {
                    return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
                }

                return Json(can, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetCandidateReportPdf(long id)
        {
            long specialistId = -1;
            try
            {
                if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
                {
                    return RedirectToAction("ErrorDontHavePermission", "Error");
                }
                var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.SpecialistId == specialistId);
                if (can == null)
                {
                    return RedirectToAction("ErrorDontHavePermission", "Error");
                }

                var attachment = db.AttachmentFiles.Where(s => s.CandidateId == id).OrderByDescending(s => s.AttachmentFileId).Take(1).Single();
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
