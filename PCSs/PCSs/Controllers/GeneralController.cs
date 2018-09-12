using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs.Controllers
{
    public class GeneralController : Controller
    {
        // GET: General
        public ActionResult ForgetPassword()
        {
            return View();
        }
    }
}