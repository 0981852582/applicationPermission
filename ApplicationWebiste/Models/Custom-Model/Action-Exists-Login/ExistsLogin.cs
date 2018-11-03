using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class ExistsLogin : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            account session = (account)filterContext.HttpContext.Session.Contents["informationOfAccount"];
            if (session == null)
            {
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary {
                                { "Controller", "Login" },
                                { "Action", "Index" }
                                });
        }
        }
    }
}