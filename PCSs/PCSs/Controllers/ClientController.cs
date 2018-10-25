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
using System.Data.Entity.Migrations;

namespace PCSs.Controllers
{
    [ClientAuthorization]
    public class ClientController : Controller
    {
        private PCSEntities db = new PCSEntities();
        // GET: Client Manager
        public ActionResult ManageAccount(long id)
        {
            ViewBag.RecruiterId = id;
            var recruiter = db.Recruiters.FirstOrDefault(s => s.RecruiterId == id);
            if (recruiter != null)
            {
                ViewBag.Title = recruiter.FirstName + " " + recruiter.MiddleName + " " + recruiter.LastName;
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
            var result = Json(db.Candidates.Where(s => s.RecruiterId == id).OrderBy(s => s.CandidateId), JsonRequestBehavior.AllowGet);
            return result;
        }
        public JsonResult GetAllCandidateCompleted(long id)
        {
            //if (recruiterId == null)
            //    return Json(new { msg = "Can't find user id" }, JsonRequestBehavior.AllowGet);
            var result = Json(db.Candidates.Where(s => s.RecruiterId == id && s.Status == "Completed").OrderBy(s => s.CandidateId), JsonRequestBehavior.AllowGet);
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
            candidate.FirstName = can.FirstName;
            candidate.MiddleName = can.MiddleName;
            candidate.LastName = can.LastName;
            candidate.Email = can.Email;
            candidate.PhoneNumber = can.PhoneNumber;
            candidate.JobTitle = can.JobTitle;
            candidate.JobLevel = can.JobLevel;
            //db.Entry(candidate).State = EntityState.Modified;
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(long id)
        {
            db.Candidates.Remove(db.Candidates.FirstOrDefault(s => s.CandidateId == id && s.RecruiterId == long.Parse(Session["RecruiterId"].ToString())));
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

        public JsonResult UpdateRecruiterProfile(Recruiter newRecruiter)
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { msg = "Error: Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
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
                    var rs = db.SaveChanges();
                    return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { msg = "1" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdatePassword()
        {
            long recruitID = -1;
            if (!long.TryParse(Session["RecruiterId"].ToString(), out recruitID))
            {
                return Json(new { msg = "Error: Can't get recruiter's profile" }, JsonRequestBehavior.AllowGet);
            }
            var recruiter = db.Recruiters.FirstOrDefault(x => x.RecruiterId == recruitID);
            if (recruiter != null)
            {
                //updatePassword 
            }
                
            return Json(new { msg = "1" }, JsonRequestBehavior.AllowGet);
        }
        // GET: Clients
        public async Task<ActionResult> Index()
        {
            return View(await db.Clients.ToListAsync());
        }

        // GET: Clients/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Client client = await db.Clients.FindAsync(id);
            if (client == null)
            {
                return HttpNotFound();
            }
            return View(client);
        }

        // GET: Clients/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Clients/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ClientId,Name,TaxCode,Address,Website,Description,StartDate,StopDate,PackageValue")] Client client)
        {
            if (ModelState.IsValid)
            {
                db.Clients.Add(client);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(client);
        }

        // GET: Clients/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Client client = await db.Clients.FindAsync(id);
            if (client == null)
            {
                return HttpNotFound();
            }
            return View(client);
        }

        // POST: Clients/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ClientId,Name,TaxCode,Address,Website,Description,StartDate,StopDate,PackageValue")] Client client)
        {
            if (ModelState.IsValid)
            {
                db.Entry(client).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(client);
        }

        // GET: Clients/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Client client = await db.Clients.FindAsync(id);
            if (client == null)
            {
                return HttpNotFound();
            }
            return View(client);
        }

        // POST: Clients/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            Client client = await db.Clients.FindAsync(id);
            db.Clients.Remove(client);
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
