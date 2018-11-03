using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class DataAccess : ActionFilterAttribute
    {
        dbContext _dbContext = new dbContext();
        public string childOfFunction { get; set; }
        public string Function { get; set; }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {


            account session = (account)filterContext.HttpContext.Session.Contents["informationOfAccount"];
            if(session != null)
            {
                var stringQuery = string.Format("SELECT  [dbo].[permission_of_childOfFunction_number]('{0}','{1}','{2}')", session.Account1, Function, childOfFunction);
                var dataReturn = _dbContext.Database.SqlQuery<int>(stringQuery).SingleOrDefault<int>();
                if (dataReturn == 0)
                {
                    filterContext.Result = new EmptyResult();
                    return;
                }
                base.OnActionExecuting(filterContext);
            }
            else
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "controller", "Home" }, { "action", "Index" } });
            }
            
        }
        public class resultReturnOfFunctionSql
        {
            public int result { get; set; }
        }
    }
}