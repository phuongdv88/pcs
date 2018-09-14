using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs.Models
{
    public class AdminAuthorization : AuthorizeAttribute
    {

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (HttpContext.Current.Session["UserId"] == null || !HttpContext.Current.Request.IsAuthenticated)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    filterContext.HttpContext.Response.StatusCode = 302; //Found Redirection to another page. Here- login page. Check Layout ajaxError() script.
                    filterContext.HttpContext.Response.End();
                }
                else
                {
                    filterContext.Result = new RedirectResult(System.Web.Security.FormsAuthentication.LoginUrl + "?ReturnUrl=" +
                         filterContext.HttpContext.Server.UrlEncode(filterContext.HttpContext.Request.RawUrl));
                }
            }
            else
            {

                //Code HERE for page level authorization
                if (HttpContext.Current.Session["Role"] == null
                    || HttpContext.Current.Session["Role"].ToString() != UserRole.ADMIN.ToString("D"))
                {
                    // signed in but don't have permission to access
                    filterContext.Result = new RedirectResult("~/Error/ErrorDontHavePermission");
                }
            }
        }
    }
}