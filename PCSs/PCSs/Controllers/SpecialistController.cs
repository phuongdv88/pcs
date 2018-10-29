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

        public ActionResult ManageSpecialistAccount(long? id)
        {
            if (id == null)
            {
                return RedirectToAction("Error", "Error");
            }
            if (Session["Role"] == null || Session["Role"]?.ToString() != "2")
                return RedirectToAction("Error", "Error");

            ViewBag.Specialist = id;
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == id);
            if (specialist != null)
            {
                ViewBag.Title = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName;
            }
            return View();
        }
        /// <summary>
        /// Get all Candidate
        /// </summary>
        /// <returns></returns>

        public JsonResult GetAvailableCandidate()
        {
            var result = Json(db.Candidates.Where(s=> ((s.Status ==  "Initial" || s.Status == "Ready") && s.SpecialistId == -1)).OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            //todo:fortest
            //var result = Json(db.Candidates.OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult GetAllCandidateCompleted()
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            var result = Json(db.Candidates.Where(s => (s.SpecialistId == specialistId && (s.Status == "Completed" || s.Status == "Closed"))).OrderByDescending(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            return result;
        }

        public JsonResult GetCandidateReport(long id)
        {
            // return link file of Candidate report
            return Json(new { link = "link_file_of_report" }, JsonRequestBehavior.AllowGet);
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

        public JsonResult GetSpecialistProfile()
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
            }
            var specialist = db.Specialists.FirstOrDefault(x => x.SpecialistId == specialistId);
            return Json(specialist, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReportForChart()
        {
            long specialistId = -1;
            if (!long.TryParse(Session["SpecialistId"].ToString(), out specialistId))
            {
                return Json(new { msg = "Error: Can't get specialist's profile" }, JsonRequestBehavior.AllowGet);
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
                    return Json(new { rs = r, msg = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { rs = -1, msg = "1" }, JsonRequestBehavior.AllowGet);
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
            //todo: for test
            //var can = db.Candidates.FirstOrDefault(s => s.CandidateId == id);
            if (can != null)
            {
                try
                {
                    //upload file and save link to candidate by id
                    HttpPostedFileBase file = Request.Files[0]; //Uploaded file
                    // Create directory to save this file
                    string filePath =Util.Helper.getRandomAlphaNumeric(10);
                    while (Directory.Exists(Server.MapPath("~/Reports/") + filePath))
                    {
                        filePath =Util.Helper.getRandomAlphaNumeric(10);
                    }
                    Directory.CreateDirectory(Server.MapPath("~/Reports/") + filePath);
                    filePath += "/" + file.FileName; ;
                    //To save file, use SaveAs method
                    file.SaveAs(Server.MapPath("~/Reports/") + filePath);
                    AttachmentFile attachment = new AttachmentFile() { Link = Server.MapPath("~/Reports/") + filePath, CandidateId = id, FileName = file.FileName };
                    db.AttachmentFiles.Add(attachment);
                    db.SaveChanges();
                    return Json(new { result = 1, msg = "Uploaded " + Request.Files.Count + " files" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    return Json(new { msg = e.Message }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new { result = -1, msg = "Can't get candidate's information" }, JsonRequestBehavior.AllowGet);

        }
        // GET: Specialists/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Specialist specialist = await db.Specialists.FindAsync(id);
            if (specialist == null)
            {
                return HttpNotFound();
            }
            return View(specialist);
        }

        // POST: Specialists/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "SpecialistId,FirstName,MiddleName,LastName,Email,PhoneNumber,Role,UserLoginId")] Specialist specialist)
        {
            if (ModelState.IsValid)
            {
                db.Entry(specialist).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(specialist);
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
