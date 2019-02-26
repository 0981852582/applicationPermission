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
            public string functionCategories { get; set; }
            public string functionCategoriesTitle { get; set; }
            public string Title { get; set; }
            public string Url { get; set; }
            public string Description { get; set; }
        }
        class Menu_P_viewMenuPermission
        {
            public string functionCategories { get; set; }
            public string functionCategoriesTitle { get; set; }
            public List<P_viewMenuPermission> List_P_viewMenuPermission { get; set; }
            public Menu_P_viewMenuPermission()
            {
                this.List_P_viewMenuPermission = new List<P_viewMenuPermission>();
            }
        }
        [HttpPost]
        public object viewMenuPermission()
        {
            List<Menu_P_viewMenuPermission> Menu = new List<Menu_P_viewMenuPermission>();
            account session = (account)Session["informationOfAccount"];
            var stringQuery = string.Format("EXECUTE P_viewMenuPermission '{0}'", session.Account1);
            var dataReturn = _dbContext.Database.SqlQuery<P_viewMenuPermission>(stringQuery).ToList();
            foreach(var item in dataReturn)
            {
                var checkExists = Menu.Find(x => x.functionCategories == item.functionCategories);
                if(checkExists == null)
                {

                    var addItem = new Menu_P_viewMenuPermission { functionCategories = item.functionCategories,functionCategoriesTitle = item.functionCategoriesTitle, List_P_viewMenuPermission = new List<P_viewMenuPermission>() };
                    foreach(var itemChild in dataReturn)
                    {
                        if(itemChild.functionCategories == addItem.functionCategories)
                        {
                            addItem.List_P_viewMenuPermission.Add(itemChild);
                        }
                    }
                    Menu.Add(addItem);
                }
            }
            return Json(Menu, JsonRequestBehavior.DenyGet);
        }
    }
}