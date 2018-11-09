using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using ApplicationWebiste.Models.DataTable;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ApplicationWebiste.Controllers.Manager_Permission
{
    [ExistsLogin]
    public class CityController : Controller
    {
        dbContext _dbContext = new dbContext();
        // GET: City
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object DataTable(DataTable parameter)
        {
            var count = _dbContext.Directory_City.Count(x => parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search));
            var data = _dbContext.Directory_City.Select(x => new
            {
                Id = x.ID,
                Title = x.Title,
                Description = x.Description,
                x.History
            }).
            Where(x => parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search)).OrderBy(parameter.orderBy, parameter.orderType).
            Skip(parameter.skip).
            Take(parameter.top).

            ToList();
            return Json(new { data = data, totalItem = count, location = Message_Count_Item_On_Table.createMessage(parameter.skip + 1, parameter.top, count) }, JsonRequestBehavior.AllowGet);
        }
        public class FileModel
        {
            public string contentType { get; set; }

            public string contentAsBase64String { get; set; }

            public string fileName { get; set; }

        }
        [HttpPost]
        public object Insert(List<FileModel> files, Directory_City item)
        {
            Message msg = new Message { Error = false };
            try
            {
                foreach (var file in files)
                {
                    var filecontent = file.contentAsBase64String;
                    var filetype = file.contentType;
                    var filename = file.fileName;

                    var bytes = Convert.FromBase64String(filecontent);
                    item.Attach = bytes;
                    item.FileName = file.fileName;


                }
                _dbContext.Directory_City.Add(item);
                _dbContext.SaveChanges();

                msg.Title = "Thêm mới (Tỉnh / Thành phố) thành công";
            }
            catch(Exception ex)
            {
                msg.Title = "Thêm mới (Tỉnh / Thành phố) không thành công";
                msg.Error = true;
                msg.Data = ex;
            }

            return Json(msg , JsonRequestBehavior.AllowGet);
        }
    }
}
//_dbContext.Entry(item).State = System.Data.Entity.EntityState.Modified;