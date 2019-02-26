using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using ApplicationWebiste.Models.DataTable;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApplicationWebiste.Controllers.Manager_Permission
{
    [ExistsLogin]
    public class ChildOfFunctionController : Controller
    {
        dbContext _dbContext = new dbContext();
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object GetLookupItem()
        {
            Message msg = new Message { Error = false };
            try
            {
                var result = _dbContext.childOfFunctions.Select(x => new
                {
                    LookupId = x.ChildOfFunction1,
                    LookupTitle = x.Title,
                    OrderBy = x.Order
                }).ToList();
                return Json(new { Data = result.OrderBy(x => x.OrderBy).ToList(), Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Data = ex.ToString(), Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}