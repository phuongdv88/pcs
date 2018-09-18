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

namespace PCSs.Controllers
{
    public class CompanyInfoController : Controller
    {
        private PCSEntities db = new PCSEntities();

        // GET: CompanyInfo
        public async Task<ActionResult> Index()
        {
            return View(await db.CompanyInfoes.ToListAsync());
        }

        // GET: CompanyInfo/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CompanyInfo companyInfo = await db.CompanyInfoes.FindAsync(id);
            if (companyInfo == null)
            {
                return HttpNotFound();
            }
            return View(companyInfo);
        }

        // GET: CompanyInfo/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CompanyInfo/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "CompanyInfoId,StartDate,StopDate,Jobtitle,Name,Country,Description,Address,Website,Note,CheckingStatus,CandidateId,CheckingTime,isChecked")] CompanyInfo companyInfo)
        {
            if (ModelState.IsValid)
            {
                db.CompanyInfoes.Add(companyInfo);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(companyInfo);
        }

        // GET: CompanyInfo/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CompanyInfo companyInfo = await db.CompanyInfoes.FindAsync(id);
            if (companyInfo == null)
            {
                return HttpNotFound();
            }
            return View(companyInfo);
        }

        // POST: CompanyInfo/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "CompanyInfoId,StartDate,StopDate,Jobtitle,Name,Country,Description,Address,Website,Note,CheckingStatus,CandidateId,CheckingTime,isChecked")] CompanyInfo companyInfo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(companyInfo).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(companyInfo);
        }

        // GET: CompanyInfo/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CompanyInfo companyInfo = await db.CompanyInfoes.FindAsync(id);
            if (companyInfo == null)
            {
                return HttpNotFound();
            }
            return View(companyInfo);
        }

        // POST: CompanyInfo/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            CompanyInfo companyInfo = await db.CompanyInfoes.FindAsync(id);
            db.CompanyInfoes.Remove(companyInfo);
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
