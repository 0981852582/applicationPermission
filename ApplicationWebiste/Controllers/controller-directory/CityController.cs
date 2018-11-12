using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using ApplicationWebiste.Models.DataTable;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
        public const string City_Message_InsertSuccess = "Thêm mới (Tỉnh / Thành phố) thành công";
        public const string City_Message_InsertErrror = "Thêm mới (Tỉnh / Thành phố) không thành công";
        public const string City_Message_UpdateSuccess = "Cập nhật (Tỉnh / Thành phố) thành công";
        public const string City_Message_UpdateError = "Cập nhật (Tỉnh / Thành phố) không thành công";
        public const string City_Message_DeleteSuccess = "Xóa (Tỉnh / Thành phố) thành công";
        public const string City_Message_DeleteError = "Xóa (Tỉnh / Thành phố) không thành công";
        public const string City_Message_DeleteListSuccess = "Xóa danh sách (Tỉnh / Thành phố) thành công";
        public const string City_Message_DeleteListError = "Xóa danh sách (Tỉnh / Thành phố) không thành công";
        // GET: City
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            // Lấy ra danh sách Những quyền nào trong Function account có quyền.
            ViewBag.ChildOfFunction = GetFunctionOfPagePermission.GetChildOfFunctionPagePermission(_dbContext, ((account)Session["informationOfAccount"]).Account1, FunctionNameOfSql.manager_city);
            // return ra view
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
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object GetItem(int id)
        {
            var result = _dbContext.Directory_City.Select(x=>new {
                x.ID,
                x.Title,
                x.Description,
                x.FileName,
                x.Status,
                x.City
            }).SingleOrDefault(x=>x.ID == id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public class FileModel
        {
            public string contentType { get; set; }

            public string contentAsBase64String { get; set; }

            public string fileName { get; set; }

        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public object Insert(List<FileModel> files, Directory_City item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (files == null)
                {
                    files = new List<FileModel>();
                }
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

                msg.Title = City_Message_InsertSuccess;
            }
            catch(Exception ex)
            {
                msg.Title = City_Message_InsertErrror;
                msg.Error = true;
                msg.Data = ex;
            }
            return Json(msg , JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object Update(List<FileModel> files, Directory_City item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if(files == null)
                {
                    files = new List<FileModel>();
                }   
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
                _dbContext.Entry(item).State = EntityState.Modified;
                _dbContext.Entry(item).Property(x => x.ID).IsModified = false;
                _dbContext.Entry(item).Property(x => x.History).IsModified = false;
                _dbContext.Entry(item).Property(x => x.FileName).IsModified = false;
                _dbContext.Entry(item).Property(x => x.Attach).IsModified = false;
                _dbContext.Entry(item).Property(x => x.CreatedBy).IsModified = false;
                _dbContext.Entry(item).Property(x => x.CreatedDate).IsModified = false;
                _dbContext.SaveChanges();

                msg.Title = City_Message_UpdateSuccess;
            }
            catch (Exception ex)
            {
                msg.Title = City_Message_UpdateError;
                msg.Error = true;
                msg.Data = ex;
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.export)]
        public FileResult Download()
        {
            var infoOfFile  = _dbContext.Directory_City.Select(x=>new { x.Attach,x.FileName }).FirstOrDefault();
            byte[] contents = infoOfFile.Attach;
            return File(infoOfFile.Attach, "application/pdf", infoOfFile.FileName);
}
    }
}