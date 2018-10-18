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
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var can = db.Candidates.FirstOrDefault(s => s.UserLoginId == userLoginId);
            if (can == null)
            {
                return HttpNotFound();
            }
            Session["CandidateId"] = can.CandidateId;
            ViewBag.Title = can.FirstName + " " + can.MiddleName + " " + can.LastName + " 's Information";

            List<SelectListItem> items = new List<SelectListItem>();
            items.Add(new SelectListItem { Text = "Fresher", Value = "Fresher" });
            items.Add(new SelectListItem { Text = "Junior", Value = "Junior" });
            items.Add(new SelectListItem { Text = "Senior", Value = "Senior" });
            items.Add(new SelectListItem { Text = "Manager", Value = "Manager" });
            items.Add(new SelectListItem { Text = "Higher", Value = "Higher" });
            ViewBag.LevelType = items;
            return View(can);
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
            var can = db.Candidates.First(s => s.CandidateId == candidate.CandidateId && s.UserLoginId == userId);
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
            if (ModelState.IsValid)
            {
                db.Entry(can).State = EntityState.Modified;
                await db.SaveChangesAsync();
                // log out
                return RedirectToAction("Login", "Home");
            }
            return View(candidate);
        }
        // ajax add, edit, delete company, add, edit, delete reference
        public JsonResult GetAllCompany(long id)
        {
            var result = Json(db.CompanyInfoes.Where(s => s.CandidateId == id).OrderBy(s => s.CompanyInfoId), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult CreateCompany(CompanyInfo com)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                com.CandidateId = candidateId;
                com.isChecked = false;
                db.CompanyInfoes.Add(com);
                var rs = db.SaveChanges();
                return Json(new { msg = com.CompanyInfoId }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditCompany(CompanyInfo com)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var company = db.CompanyInfoes.First(s => s.CompanyInfoId == com.CompanyInfoId && s.CandidateId == candidateId);
                if(company != null)
                {
                    company.StartDate = com.StartDate;
                    company.StopDate = com.StopDate;
                    company.Jobtitle = com.Jobtitle;
                    company.Name = com.Name;
                    company.Address = com.Address;
                    company.Website = com.Website;
                    db.Entry(company).State = EntityState.Modified;
                    var rs = db.SaveChanges();
                    return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCompany(long id)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var com = db.CompanyInfoes.First(s => s.CompanyInfoId == id && s.CandidateId == candidateId);
                if (com != null)
                {
                    db.CompanyInfoes.Remove(com);
                    var rs = db.SaveChanges();
                    return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);

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
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var com = db.CompanyInfoes.First(s => s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId);
                if (com != null)
                {
                    db.ReferenceInfoes.Add(refe);
                    var rs = db.SaveChanges();
                    return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditReference(ReferenceInfo refe)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var com = db.CompanyInfoes.First(s => s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId);
                if (com != null)
                {
                    var reference = db.ReferenceInfoes.First(s => s.ReferenceInfoId == refe.ReferenceInfoId);
                    if (reference != null)
                    {
                        reference.FullName = refe.FullName;
                        reference.RelationShip = refe.RelationShip;
                        reference.JobTitle = refe.JobTitle;
                        reference.Email = refe.Email;
                        reference.PhoneNumber = refe.PhoneNumber;
                        db.Entry(reference).State = EntityState.Modified;
                        var rs = db.SaveChanges();
                        return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteReference(long id)
        {
            long candidateId = -1;
            if (long.TryParse(Session["CandidateId"].ToString(), out candidateId))
            {
                var refe = db.ReferenceInfoes.First(s => s.ReferenceInfoId == id);
                if (refe != null)
                {
                    var com = db.CompanyInfoes.First(s => s.CompanyInfoId == refe.CompanyInfoId && s.CandidateId == candidateId);
                    if (com != null)
                    {
                        db.ReferenceInfoes.Remove(refe);
                        var rs = db.SaveChanges();
                        return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(new { msg = "Error: You don't have permittion to change this candidate" }, JsonRequestBehavior.AllowGet);
        }
        // GET: update form
        public ActionResult UpdateProfile(long? userLoginId)
        {
            if (userLoginId == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CandidateInfo can = new CandidateInfo(userLoginId);
            if (can == null)
            {
                return HttpNotFound();
            }
            ViewBag.Title = can.CandidateGeneralInfo.FirstName + " " + can.CandidateGeneralInfo.MiddleName + " " + can.CandidateGeneralInfo.LastName + " 's Information";

            List<SelectListItem> items = new List<SelectListItem>();
            items.Add(new SelectListItem { Text = "Fresher", Value = "Fresher" });
            items.Add(new SelectListItem { Text = "Junior", Value = "Junior" });
            items.Add(new SelectListItem { Text = "Senior", Value = "Senior" });
            items.Add(new SelectListItem { Text = "Manager", Value = "Manager" });
            items.Add(new SelectListItem { Text = "Higher", Value = "Higher" });
            ViewBag.LevelType = items;

            return View(can);
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
