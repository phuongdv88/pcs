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
    [AdminAuthorization]
    public class AdminController : Controller
    {
        private PCSEntities db = new PCSEntities();

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
    }
}
