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

namespace PCSs.Controllers
{
    [CandidateAuthorization]
    public class CandidateController : Controller
    {
        private PCSEntities db = new PCSEntities();

        // GET: Candidates
        public async Task<ActionResult> Index()
        {
            return View(await db.Candidates.ToListAsync());
        }

        public ActionResult EditProfile(long? userLoginId)
        {
            if (userLoginId == null)
            {
                return RedirectToAction("Error", "Error");
                //return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var can = db.Candidates.FirstOrDefault(s => s.UserLoginId == userLoginId);
            if (can == null)
            {
                return HttpNotFound();
            }
            Session["CandidateId"] = can.CandidateId;
            ViewBag.CandidateId = can.CandidateId;
            if (can.MiddleName == null)
            {
                ViewBag.Title = can.FirstName + " " + can.LastName;
            }
            else
            {
                ViewBag.Title = can.FirstName + " " + can.MiddleName + " " + can.LastName + " 's Information";

            }
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EditProfile([Bind(Include = "CandidateId,FirstName,MiddleName,LastName,Email,PhoneNumber,Address,Gender,DOB,JobTitle,JobLevel,IDNumber")] Candidate candidate)
        {
            long userId = -1;
            if (!long.TryParse(Session["UserId"].ToString(), out userId))
            {
                return RedirectToAction("Error", "Error");
            }
            var can = db.Candidates.FirstOrDefault(s => (s.CandidateId == candidate.CandidateId && s.UserLoginId == userId));
            if (candidate == null)
            {
                return RedirectToAction("Error", "Error");
            }
            can.FirstName = candidate.FirstName;
            can.MiddleName = candidate.MiddleName;
            can.LastName = candidate.LastName;
            can.Email = candidate.Email;
            can.PhoneNumber = candidate.PhoneNumber;
            can.Address = candidate.Address;
            can.Gender = candidate.Gender;
            can.DOB = candidate.DOB;
            can.JobLevel = candidate.JobLevel;
            can.JobTitle = candidate.JobTitle;
            can.IDNumber = candidate.IDNumber;
            can.Status = "Ready";
            if (ModelState.IsValid)
            {
                db.Entry(can).State = EntityState.Modified;
                await db.SaveChangesAsync();
                // log out
                return RedirectToAction("Login", "Home");
            }
            return RedirectToAction("Login", "Home");
        }

        public JsonResult GetCandidateInfo()
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var can = db.Candidates.FirstOrDefault(s => s.CandidateId == candidateId);
                    return Json(can, JsonRequestBehavior.AllowGet);
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult UpdateCandidateInfo(Candidate candidate)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var can = db.Candidates.FirstOrDefault(s => s.CandidateId == candidateId);
                    if (can.FirstName != candidate.FirstName ||
                    can.LastName != candidate.LastName ||
                    can.Gender != candidate.Gender ||
                    can.Email != candidate.Email ||
                    can.PhoneNumber != candidate.PhoneNumber ||
                    can.DOB != candidate.DOB ||
                    can.IDNumber != candidate.IDNumber ||
                    can.JobTitle != candidate.JobTitle ||
                    can.JobLevel != candidate.JobLevel ||
                    can.Address != candidate.Address)
                    {
                        can.FirstName = candidate.FirstName;
                        can.MiddleName = candidate.MiddleName;
                        can.LastName = candidate.LastName;
                        can.Gender = candidate.Gender;
                        can.Email = candidate.Email;
                        can.PhoneNumber = candidate.PhoneNumber;
                        can.DOB = candidate.DOB;
                        can.IDNumber = candidate.IDNumber;
                        can.JobTitle = candidate.JobTitle;
                        can.JobLevel = candidate.JobLevel;
                        can.Address = candidate.Address;
                        if(can.Status == "Initial")
                        {
                            can.Status = "Ready";
                        }
                        db.Entry(can).State = EntityState.Modified;
                        var result = db.SaveChanges();
                        return Json(new { rs = result, msg = "Successfully" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        // ajax add, edit, delete company, add, edit, delete reference
        public JsonResult GetAllCompany()
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                return Json(db.CompanyInfoes.Where(s => s.CandidateId == candidateId).OrderBy(s => s.CompanyInfoId), JsonRequestBehavior.AllowGet);
            }
            return Json(new {rs = -1, msg="Permission Denied" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CreateCompany(CompanyInfo com)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    com.CandidateId = candidateId;
                    com.IsChecked = false;
                    db.CompanyInfoes.Add(com);
                    var rs = db.SaveChanges();
                    return Json(new { comId = com.CompanyInfoId }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult EditCompany(CompanyInfo com)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var company = db.CompanyInfoes.FirstOrDefault(s => (s.CompanyInfoId == com.CompanyInfoId && s.CandidateId == candidateId));
                if (company != null)
                {
                    if (com.StartDate != company.StartDate ||
                        company.StopDate != com.StopDate ||
                    company.Jobtitle != com.Jobtitle ||
                    company.Name != com.Name ||
                    company.Address != com.Address ||
                    company.Website != com.Website ||
                    company.JobDuties != com.JobDuties)
                    {
                        company.StartDate = com.StartDate;
                        company.StopDate = com.StopDate;
                        company.Jobtitle = com.Jobtitle;
                        company.Name = com.Name;
                        company.Address = com.Address;
                        company.Website = com.Website;
                        company.JobDuties = com.JobDuties;

                        db.Entry(company).State = EntityState.Modified;
                        var r = db.SaveChanges();
                        return Json(new { rs = r, msg = "Successfully" }, JsonRequestBehavior.AllowGet);
                    }
                    else return Json(new { rs = -1, msg = "1" }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCompany(long id)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var com = db.CompanyInfoes.FirstOrDefault(s => (s.CompanyInfoId == id && s.CandidateId == candidateId));
                    if (com != null)
                    {
                        db.CompanyInfoes.Remove(com);
                        var r = db.SaveChanges();
                        return Json(new { rs = r, msg = "Successfully" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetAllReference(long id)
        {
            var test = db.ReferenceInfoes.Where(s => s.CompanyInfoId == id).OrderBy(s => s.ReferenceInfoId);
            var result = Json(db.ReferenceInfoes.Where(s => s.CompanyInfoId == id), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult CreateReference(ReferenceInfo refe)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var com = db.CompanyInfoes.FirstOrDefault(s => (s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId));
                    if (com != null)
                    {
                        refe.CheckingStatus = "Initial";
                        db.ReferenceInfoes.Add(refe);
                        var r = db.SaveChanges();
                        return Json(new { rs = r, msg = "" }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult EditReference(ReferenceInfo refe)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var com = db.CompanyInfoes.FirstOrDefault(s => (s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId));
                    if (com != null)
                    {
                        var reference = db.ReferenceInfoes.FirstOrDefault(s => (s.ReferenceInfoId == refe.ReferenceInfoId && s.CompanyInfoId == com.CompanyInfoId));
                        if (reference != null)
                        {
                            if (reference.FullName != refe.FullName ||
                            reference.RelationShip != refe.RelationShip ||
                            reference.JobTitle != refe.JobTitle ||
                            reference.Email != refe.Email ||
                            reference.PhoneNumber != refe.PhoneNumber)
                            {
                                reference.FullName = refe.FullName;
                                reference.RelationShip = refe.RelationShip;
                                reference.JobTitle = refe.JobTitle;
                                reference.Email = refe.Email;
                                reference.PhoneNumber = refe.PhoneNumber;
                                db.Entry(reference).State = EntityState.Modified;
                                var r = db.SaveChanges();
                                return Json(new { rs = r, msg = "" }, JsonRequestBehavior.AllowGet);
                            }
                            else return Json(new { rs = -1, msg = "1" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteReference(long id)
        {
            long candidateId = -1;
            try
            {
                if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
                {
                    var refe = db.ReferenceInfoes.FirstOrDefault(s => s.ReferenceInfoId == id);
                    if (refe != null)
                    {
                        var com = db.CompanyInfoes.FirstOrDefault(s => (s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId));
                        if (com != null)
                        {
                            db.ReferenceInfoes.Remove(refe);
                            var r = db.SaveChanges();
                            return Json(new { rs = r, msg = "" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                return Json(new { rs = -1, msg = "Permission Denied" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return Json(new { rs = -1, msg = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        // GET: Candidates/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Candidate candidate = await db.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return HttpNotFound();
            }
            return View(candidate);
        }

        // GET: Candidates/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Candidates/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "CandidateId,FirstName,MiddleName,LastName,Email,PhoneNumber,Address,Genger,DOB,JobTitle,JobLevel,ClientId,RecruiterId,CreatedTime,LastUpdateReportTime,CompleteTime,Note,Status,PictureLink,IssuranceNumber,IDNumber,IDDate,IDSupply,UserLoginId")] Candidate candidate)
        {
            if (ModelState.IsValid)
            {
                db.Candidates.Add(candidate);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(candidate);
        }

        // GET: Candidates/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Candidate candidate = await db.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return HttpNotFound();
            }
            return View(candidate);
        }

        // POST: Candidates/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "CandidateId,FirstName,MiddleName,LastName,Email,PhoneNumber,Address,Genger,DOB,JobTitle,JobLevel,ClientId,RecruiterId,CreatedTime,LastUpdateReportTime,CompleteTime,Note,Status,PictureLink,IssuranceNumber,IDNumber,IDDate,IDSupply,UserLoginId")] Candidate candidate)
        {
            if (ModelState.IsValid)
            {
                db.Entry(candidate).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(candidate);
        }

        // GET: Candidates/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Candidate candidate = await db.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return HttpNotFound();
            }
            return View(candidate);
        }

        // POST: Candidates/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            Candidate candidate = await db.Candidates.FindAsync(id);
            db.Candidates.Remove(candidate);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
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
