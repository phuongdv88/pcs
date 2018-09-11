using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PCSs.Models;
using System.Web.Security;
using System.Security.Principal;
using PCSs.Util;

namespace PCSs.Controllers
{
    [CheckAuthorization]
    public class HomeController : Controller
    {
        // GET: Home
        [HttpGet]
        public ActionResult Login(string returnURL)
        {
            var userInfo = new UserLoginInfo();
            try
            {
                EnsureLoggedOut();
                // Store the originating URL so we can attach it to a form field
                return View(userInfo);
            }
            catch {
                throw;
            }
        }

        //GET: SignInAsync
        private void SignInRemember(string userName, bool isPersistent = false)
        {
            //clear any linger authencation data
            FormsAuthentication.SignOut();
            // write the authentication cookie
            FormsAuthentication.SetAuthCookie(userName, isPersistent);
        }
        //GET: RedirectToLocal
        private ActionResult RedirectToLocal(string returnURL = "")
        {
            try {
                // If the return url starts with a slash "/" we assume it belongs to our site
                // so we will redirect to this "action"
                if(!string.IsNullOrWhiteSpace(returnURL) && Url.IsLocalUrl(returnURL))
                {
                    return Redirect(returnURL);
                }
                return RedirectToAction("Index");
            } catch { throw; }
        }

        private void EnsureLoggedOut()
        {
            // if the request is marked as authenticated we send the user to the Logout action
            if (Request.IsAuthenticated)
            {
                Logout();
            }
        }

        //POST: logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Logout()
        {
            try
            {
                //First we clean the authentication ticket like always
                FormsAuthentication.SignOut();

                // Second we clear the principal to ensure the user does not retain any authentication 
                HttpContext.User = new GenericPrincipal(new GenericIdentity(string.Empty), null);
                Session.Clear();
                System.Web.HttpContext.Current.Session.RemoveAll();

                // Last we redirect to a controller/action that requres authentication to ensure a redirect takes place
                // this clears the request.isAuthenticated flag since this triggers a new request
                return RedirectToLocal();

            }
            catch { throw; }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(UserLoginInfo entity)
        {
            string oldHashValue = string.Empty;
            string salt = string.Empty;

            try
            {
                using(var db = new PCSEntities()) {
                    // ensure we have a valid vewModel to work with
                    if (!ModelState.IsValid)
                    {
                        return View(entity);
                    }
                    // retrive stored hash value from database according to username
                    var userInfo = db.UserLogins.Where(s => s.UserName == entity.UserName.Trim()).FirstOrDefault();
                    if(userInfo != null)
                    {
                        oldHashValue = userInfo.PasswordHash;
                        salt = userInfo.SecurityStamp;
                    }

                    bool isLogin = Helper.CompareMD5HashValue(entity.Password, entity.UserName, salt, oldHashValue);

                    if (isLogin)
                    {
                        // Login success
                        // For set authentication in Cookie (remember me option)
                        SignInRemember(entity.UserName, entity.IsRemember);
                        // set a unique id in session
                        Session["UserID"] = userInfo.UserLoginId;

                        // if we got this far, something failed, redisplay form 

                        return RedirectToLocal(entity.ReturnURL);
                    }
                    else
                    {
                        // login fail
                        TempData["ErrorMSG"] = "Access Denied! Wrong Credential";
                        return View(entity);
                    }

                }
            }
            catch 
            {

                throw;
            }
        }


        
    }
}