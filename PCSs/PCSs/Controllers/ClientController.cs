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
    [ClientAuthorization]
    public class ClientController : Controller
    {
        private PCSEntities db = new PCSEntities();
        private static long CurrentRecruiterId = -1;

        // GET: Client Manager

        public ActionResult ManageAccount(long id)
        {
            ViewBag.RecruiterId = id;
            CurrentRecruiterId = id;
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
            var result = Json(db.Candidates.Where(s => s.RecruiterId == id), JsonRequestBehavior.AllowGet);
            return result;
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
                JobLevel = can.JobTitle,
                RecruiterId = CurrentRecruiterId,
                CreatedTime = DateTime.Now,
                Status = "Initial",

            };
            db.Candidates.Add(candidate);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateCandidate(CandidateSimpleInfo can)
        {
            var candidate = db.Candidates.First(s => s.CandidateId == can.CandidateId);
            candidate.FirstName = can.FirstName;
            candidate.MiddleName = can.MiddleName;
            candidate.LastName = can.LastName;
            candidate.Email = can.Email;
            candidate.PhoneNumber = can.PhoneNumber;
            candidate.JobTitle = can.JobTitle;
            candidate.JobLevel = can.JobLevel;
            db.Candidates.AddOrUpdate(candidate);
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(long id)
        {
            db.Candidates.Remove(db.Candidates.FirstOrDefault(s => s.CandidateId == id));
            var rs = db.SaveChanges();
            return Json(new { msg = rs }, JsonRequestBehavior.AllowGet);
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
