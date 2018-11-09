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
                    msg.Title = "Đăng nhập thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Đăng nhập không thành công";
                    msg.Data = "Không tòn tại tài khoản";
                }

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Data = ex;
                msg.Title = "Đăng nhập không thành công";
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
   
        }
    }
}