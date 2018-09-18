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
    public class ReferenceInfoController : Controller
    {
        private PCSEntities db = new PCSEntities();

        // GET: ReferenceInfo
        public async Task<ActionResult> Index()
        {
            return View(await db.ReferenceInfoes.ToListAsync());
        }

        // GET: ReferenceInfo/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ReferenceInfo referenceInfo = await db.ReferenceInfoes.FindAsync(id);
            if (referenceInfo == null)
            {
                return HttpNotFound();
            }
            return View(referenceInfo);
        }

        // GET: ReferenceInfo/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ReferenceInfo/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ReferenceInfoId,FullName,RelationShip,JobTitle,Email,PhoneNumber,Note,CheckingStatus,CheckingTime,CompanyInfoId")] ReferenceInfo referenceInfo)
        {
            if (ModelState.IsValid)
            {
                db.ReferenceInfoes.Add(referenceInfo);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(referenceInfo);
        }

        // GET: ReferenceInfo/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ReferenceInfo referenceInfo = await db.ReferenceInfoes.FindAsync(id);
            if (referenceInfo == null)
            {
                return HttpNotFound();
            }
            return View(referenceInfo);
        }

        // POST: ReferenceInfo/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ReferenceInfoId,FullName,RelationShip,JobTitle,Email,PhoneNumber,Note,CheckingStatus,CheckingTime,CompanyInfoId")] ReferenceInfo referenceInfo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(referenceInfo).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(referenceInfo);
        }

        // GET: ReferenceInfo/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ReferenceInfo referenceInfo = await db.ReferenceInfoes.FindAsync(id);
            if (referenceInfo == null)
            {
                return HttpNotFound();
            }
            return View(referenceInfo);
        }

        // POST: ReferenceInfo/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            ReferenceInfo referenceInfo = await db.ReferenceInfoes.FindAsync(id);
            db.ReferenceInfoes.Remove(referenceInfo);
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
