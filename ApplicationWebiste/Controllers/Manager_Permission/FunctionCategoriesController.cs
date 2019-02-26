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
    public class FunctionCategoriesController : Controller
    {
        dbContext _dbContext = new dbContext();
        [HttpPost]
        public object GetLookupItem()
        {
            Message msg = new Message { Error = false };
            try
            {
                var result = _dbContext.functionCategories.Select(x => new
                {
                    LookupId = x.functionCategories,
                    LookupTitle = x.functionCategoriesTitle,
                    OrderBy = x.OrderBy
                }).ToList();
                result.Insert(0, new
                {
                    LookupId = "",
                    LookupTitle = "Danh mục chức năng",
                    OrderBy = (byte?) null
                });
                return Json(new { Data = result.OrderBy(x => x.OrderBy).ToList(), Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Data = ex.ToString(), Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}