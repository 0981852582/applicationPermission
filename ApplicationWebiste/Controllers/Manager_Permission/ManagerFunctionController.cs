﻿using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
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
    public class ManagerFunctionController : Controller
    {
        dbContext _dbContext = new dbContext();
        // GET: ManagerFunction
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            return View();
        }
        public class C_parameter_Datatable
        {
            public int skip { get; set; }
            public int top { get; set; }
            public string orderBy { get; set; } = "Title";
            public bool orderType { get; set; } = true;
            public string search { get; set; }

        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object DataTable(C_parameter_Datatable parameter)
        {            
            var count = _dbContext.functions.Count(x => parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search));
            var data = _dbContext.functions.Select(x => new
            {
                Id = x.ID,
                Title = x.Title,
                Description = x.Description,
                Url = x.Url,
                x.History
            }).
            Where(x => parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search)).OrderBy(parameter.orderBy, parameter.orderType).
            Skip(parameter.skip).
            Take(parameter.top).

            ToList();
            return Json(new { data = data, totalItem = count, location = Message_Count_Item_On_Table.createMessage(parameter.skip + 1, parameter.top, count) }, JsonRequestBehavior.AllowGet);
        }
        
    }
}