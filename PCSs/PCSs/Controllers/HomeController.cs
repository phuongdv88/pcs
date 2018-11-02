using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PCSs.Models;
using System.Web.Security;
using System.Security.Principal;
using PCSs.Util;
using System.Security.Cryptography;

namespace PCSs.Controllers
{
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
                userInfo.ReturnURL = returnURL;
                return View(userInfo);
            }
            catch
            {
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

            //int timeout = isPersistent ? 525600 : 2;
            //var ticket = new FormsAuthenticationTicket(userName, isPersistent, timeout);
            //string encrypted = FormsAuthentication.Encrypt(ticket);
            //var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encrypted);
            //cookie.Expires = System.DateTime.Now.AddMinutes(timeout);
            //Response.Cookies.Add(cookie);


        }
        //GET: RedirectToLocal
        private ActionResult RedirectToLocal(string returnURL = "", int role = -1)
        {
            try
            {
                // If the return url starts with a slash "/" we assume it belongs to our site
                // so we will redirect to this "action"
                if (!string.IsNullOrWhiteSpace(returnURL) && Url.IsLocalUrl(returnURL))
                    return Redirect(returnURL);
                else if (string.IsNullOrEmpty(returnURL))
                {
                    switch ((UserRole)role)
                    {
                        case UserRole.ADMIN:
                            //admin 
                            // return RedirectToAction("Index", "Admin");
                            //to do test
                            return RedirectToAction("EditAccount", "Admin");
                        case UserRole.CLIENT:
                            // Recruiter
                            return RedirectToAction("ManageAccount", "Client");

                        case UserRole.SPECIALIST:
                            // specialist
                            return RedirectToAction("Index", "Specialist");

                        case UserRole.CANDIDATE:
                            // Candidate
                            return RedirectToAction("EditProfile", "Candidate");
                        default:
                            return RedirectToAction("Login  ", "Home");
                    }
                }
                return RedirectToAction("Login", "Home");


            }
            catch { throw; }
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
                Session.Abandon();
                System.Web.HttpContext.Current.Session.RemoveAll();

                // Last we redirect to a controller/action that requres authentication to ensure a redirect takes place
                // this clears the request.isAuthenticated flag since this triggers a new request
                return RedirectToAction("Login", "Home");
                //return RedirectToLocal();

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
                using (var db = new PCSEntities())
                {
                    // ensure we have a valid vewModel to work with
                    if (!ModelState.IsValid)
                    {
                        return View(entity);
                    }
                    // retrive stored hash value from database according to username
                    var userInfo = db.UserLogins.Where(s => s.UserName == entity.UserName.Trim()).FirstOrDefault();
                    if (userInfo != null)
                    {
                        oldHashValue = userInfo.PasswordHash;
                        salt = userInfo.SecurityStamp;
                    }

                    bool isLogin = Helper.CompareMD5HashValue(entity.Password, entity.UserName, salt, oldHashValue);

                    if (isLogin)
                    {
                        // Login success
                        // check lockoutdate
                        if (userInfo.LockoutEnabled)
                        {
                            if (userInfo.LockoutDateUtc != null && userInfo.LockoutDateUtc < DateTime.UtcNow)
                            {
                                // account is expired
                                throw new Exception("Access Denied! This account is expired");
                            }
                        }
                        var returnToUrllink = false;
                        if (!string.IsNullOrWhiteSpace(entity.ReturnURL) && Url.IsLocalUrl(entity.ReturnURL))
                            returnToUrllink = true;

                        // For set authentication in Cookie (remember me option)
                        SignInRemember(entity.UserName, entity.IsRemember);
                        // set a unique id in session
                        Session["UserId"] = userInfo.UserLoginId;
                        Session["UserName"] = userInfo.UserName;
                        Session["Role"] = userInfo.Role;
                        switch ((UserRole)userInfo.Role)
                        {
                            case UserRole.ADMIN:
                                //admin 
                                // return RedirectToAction("Index", "Admin");
                                // to do test
                                if (!returnToUrllink)
                                {
                                    return RedirectToAction("EditAccount", "Admin");
                                }
                                break;
                            case UserRole.CLIENT:
                                var recruiter = db.Recruiters.FirstOrDefault(s => s.UserLoginId == userInfo.UserLoginId);
                                if (recruiter == null)
                                {
                                    return RedirectToAction("Error", "Error");
                                }
                                // Recruiter
                                var recruiterId = db.Recruiters.FirstOrDefault(s => s.UserLoginId == userInfo.UserLoginId).RecruiterId;
                                Session["RecruiterId"] = recruiter.RecruiterId;
                                Session["ClientId"] = recruiter.ClientId;
                                if (!returnToUrllink)
                                {
                                    return RedirectToAction("ManageAccount", "Client");

                                }
                                break;

                            case UserRole.SPECIALIST:
                                // specialist
                                var specialistId = db.Specialists.FirstOrDefault(s => s.UserLoginId == userInfo.UserLoginId).SpecialistId;
                                Session["SpecialistId"] = specialistId;
                                if (!returnToUrllink)
                                {
                                    return RedirectToAction("ManageSpecialistAccount", "Specialist", new { id = specialistId });
                                }
                                break;

                            case UserRole.CANDIDATE:
                                // Candidate
                                // get candidate id
                                if (!returnToUrllink)
                                {
                                    return RedirectToAction("EditProfile", "Candidate", new { userLoginId = userInfo.UserLoginId });
                                }
                                break;
                            default:
                                return RedirectToAction("Login", "Home");
                        }
                        return Redirect(entity.ReturnURL);
                    }
                    else
                    {
                        // login fail
                        throw new Exception("Access Denied! Wrong Credential.");
                    }

                }
            }
            catch (Exception e)
            {
                TempData["ErrorMSG"] = e.Message;
                return View(entity);


            }
        }




    }
}