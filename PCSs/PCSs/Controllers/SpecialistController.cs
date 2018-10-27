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
            ViewBag.Specialist = id;
            var specialist = db.Specialists.FirstOrDefault(s => s.SpecialistId == id);
            if (specialist != null)
            {
                ViewBag.Title = specialist.FirstName + " " + specialist.MiddleName + " " + specialist.LastName;
            }
            return View();
        }

        // GET: Specialists
        public async Task<ActionResult> Index()
        {
            if (Session["Role"] == null || Session["Role"]?.ToString() != "2")
                return RedirectToAction("Error", "Error");
            return View(await db.Specialists.ToListAsync());
        }

        // GET: Specialists/Details/5
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

        // GET: Specialists/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Specialists/Create
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

        // GET: Specialists/Delete/5
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

        // POST: Specialists/Delete/5
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
