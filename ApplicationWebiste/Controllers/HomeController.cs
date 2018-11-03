using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApplicationWebiste.Controllers
{
    [ExistsLogin]
    public class HomeController : Controller
    {
        dbContext _dbContext = new dbContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        class P_viewMenuPermission
        {
            public string Function { get; set; }
            public string Parent { get; set; }
            public string Title { get; set; }
            public string Url { get; set; }
            public string Description { get; set; }
        }
        [HttpPost]
        public object viewMenuPermission()
        {
            account session = (account)Session["informationOfAccount"];
            var stringQuery = string.Format("EXECUTE P_viewMenuPermission '{0}'", session.Account1);
            var dataReturn = _dbContext.Database.SqlQuery<P_viewMenuPermission>(stringQuery).ToList();
            return Json(dataReturn , JsonRequestBehavior.DenyGet);
        }
    }
}