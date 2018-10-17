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
            // what happen if user change candidateid and post data then?

            
            if (ModelState.IsValid)
            {
                db.Entry(candidate).State = EntityState.Modified;
                await db.SaveChangesAsync();
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
            db.CompanyInfoes.Add(com);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditCompany(CompanyInfo com)
        {
            db.CompanyInfoes.AddOrUpdate(com);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCompany(long id)
        {
            db.CompanyInfoes.Remove(db.CompanyInfoes.First(s => s.CompanyInfoId == id));
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllReference(long id)
        {
            var test = db.ReferenceInfoes.Where(s => s.CompanyInfoId == id).OrderBy(s => s.ReferenceInfoId);
            var result = Json(db.ReferenceInfoes.Where(s => s.CompanyInfoId == id), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult CreateReference(ReferenceInfo refe)
        {
            db.ReferenceInfoes.Add(refe);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditReference(ReferenceInfo refe)
        {
            db.ReferenceInfoes.AddOrUpdate(refe);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteReference(long id)
        {
            db.ReferenceInfoes.Remove(db.ReferenceInfoes.First(s => s.ReferenceInfoId == id));
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
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
