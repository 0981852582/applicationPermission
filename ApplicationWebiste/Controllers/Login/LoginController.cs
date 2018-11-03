using ApplicationWebiste.Models;
using System.Web.Mvc;
using System.Linq;
using ApplicationWebiste.Models.Custom_Model;
using System;

namespace ApplicationWebiste.Controllers.Login
{
    public class LoginController : Controller
    {
        dbContext _dbContext = new dbContext();
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        public class C_Login
        {
            public string account { get; set; }
            public string password { get; set; }
        }
        [HttpPost]
        public object Login(C_Login parameter)
        {
            Message msg = new Message { Error = false };
            try
            {
                var data = _dbContext.accounts.Where(x => x.Account1 == parameter.account && x.Password == x.Password).FirstOrDefault();
                if (data != null)
                {
                    Session["informationOfAccount"] = data;
                    msg.Title = "Dang nhap thanh cong";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Login khong thanh cong";
                    msg.Data = "khog ton tai khoan";
                }

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Data = ex;
                msg.Title = "Login khong thanh cong";
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
   
        }
    }
}