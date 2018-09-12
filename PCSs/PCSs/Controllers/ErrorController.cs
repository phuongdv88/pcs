using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Error()
        {
            return View();
        }
        public ActionResult ErrorDontHavePermission()
        {
            return View();
        }
        public ActionResult ErrorCantVerifyAccount()
        {
            return View();
        }
    }
}