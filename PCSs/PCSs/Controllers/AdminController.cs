﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PCSs.Models;

namespace PCSs.Controllers
{
    [AdminAuthorization]
    public class AdminController : Controller
    {
        private PCSEntities db = new PCSEntities();

        //editAccount
        public ActionResult EditAccount()
        {
            return View();
        }

        // bill report
        public ActionResult BillReport()
        {
            return View();
        }

        // GET: Admin
        public async Task<ActionResult> Index()
        {
            return View(await db.Specialists.ToListAsync());
        }

        // GET: Admin/Details/5
        public async Task<ActionResult> Details(long? id)
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

        // GET: Admin/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "SpecialistId,FirstName,MiddleName,LastName,Email,PhoneNumber,Role,UserLoginId")] Specialist specialist)
        {
            if (ModelState.IsValid)
            {
                db.Specialists.Add(specialist);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(specialist);
        }

        // GET: Admin/Edit/5
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

        // POST: Admin/Edit/5
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

        // GET: Admin/Delete/5
        public async Task<ActionResult> Delete(long? id)
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

        // POST: Admin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            Specialist specialist = await db.Specialists.FindAsync(id);
            db.Specialists.Remove(specialist);
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

        // GET all specialist
        public JsonResult GetAllSpecialist()
        {
            var queryAllSpecialist = from specialist in db.Specialists select specialist;
            return Json(queryAllSpecialist,JsonRequestBehavior.AllowGet);
        }
        // Create specialist
        public JsonResult CreateSpecialist(Specialist spec)
        {
            var userLogin = new UserLogin()
            {
                UserName = Util.Helper.getRandomAlphaNumeric(6).ToUpper(),
                PasswordRaw = Util.Helper.getRandomAlphaNumeric(8),
                SecurityStamp = Util.Helper.getRandomAlphaNumeric(100),
                Role = (int)UserRole.SPECIALIST,
                AccessFailedCount = 0,
                LockoutEnabled = true,
                //LockoutDateUtc = DateTime.UtcNow.AddDays(7)
            };
            // create user name pass word
            while (db.UserLogins.Any(s => s.UserName == userLogin.UserName))
            {
                userLogin.UserName = Util.Helper.getRandomAlphaNumeric(6).ToUpper();
            }
            userLogin.PasswordHash = Util.Helper.createMD5Hash(userLogin.PasswordRaw, userLogin.UserName, userLogin.SecurityStamp);

            db.UserLogins.Add(userLogin);
            db.SaveChanges();
            // create specialist
            var specialist = new Specialist()
            {
                UserLoginId = userLogin.UserLoginId,
                FirstName = spec.FirstName,
                MiddleName = spec.MiddleName,
                LastName = spec.LastName,
                Email = spec.Email,
                PhoneNumber = spec.PhoneNumber,
                Role = (int)UserRole.SPECIALIST,

            };
            db.Specialists.Add(specialist);
            db.SaveChanges();
            return Json(new { rs=specialist.SpecialistId,msg=""},JsonRequestBehavior.AllowGet);
        }
        // delete specialist
        public JsonResult DeleteSpecialist(long id)
        {
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == id);

            // remote user login of sepcialist
            var userlogin = db.UserLogins.FirstOrDefault(s => s.UserLoginId == specialist.UserLoginId);
            if (userlogin != null)
            {
                db.UserLogins.Remove(userlogin);
            }
           
            db.Specialists.Remove(specialist);
           var r= db.SaveChanges();
            return Json(new { rs = r, msg = "" }, JsonRequestBehavior.AllowGet);

        }
        // get specialist by id
        public JsonResult GetSpecialistById(long id)
        {
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == id);

            return Json(specialist, JsonRequestBehavior.AllowGet); 
        }
        // update specialist by id
        public JsonResult UpdateSpecialist(Specialist spec)
        {
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == spec.SpecialistId);
            specialist.FirstName = spec.FirstName;
            specialist.MiddleName = spec.MiddleName;
            specialist.LastName = spec.LastName;
            specialist.PhoneNumber = spec.PhoneNumber;
            specialist.Email = spec.Email;
            db.Entry(specialist).State = EntityState.Modified;
             db.SaveChanges();
            return Json(JsonRequestBehavior.AllowGet);
        }
        // get all recruiter
        public JsonResult GetAllRecruiter()
        {
            var queryAllRecruiter = from recruiter in db.Recruiters select recruiter;
            return Json(queryAllRecruiter, JsonRequestBehavior.AllowGet);
        }

    }
}
