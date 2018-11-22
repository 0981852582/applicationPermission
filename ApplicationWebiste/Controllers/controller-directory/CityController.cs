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
        public const string City_Message_InsertImportSuccess = "Thêm mới (Tỉnh / Thành phố) bằng file thành công";
        public const string City_Message_InsertImportErrror = "Thêm mới (Tỉnh / Thành phố) bằng file không thành công";
        public const string City_Message_UpdateSuccess = "Cập nhật (Tỉnh / Thành phố) thành công";
        public const string City_Message_UpdateError = "Cập nhật (Tỉnh / Thành phố) không thành công";
        public const string City_Message_DeleteSuccess = "Xóa (Tỉnh / Thành phố) thành công";
        public const string City_Message_NotExistItem = "(Tỉnh / Thành phố) không tồn tại";
        public const string City_Message_ExistsedCity = "Mã (Tỉnh / Thành phố) đã tồn tại";
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
                City = x.City,
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
            var result = _dbContext.Directory_City.Select(x => new Directory_City_Extend
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                FileName = x.FileName,
                Status = x.Status,
                City = x.City,
                ModifiedDate = x.ModifiedDate,
                CreatedDate = x.CreatedDate,
                ModifiedBy = x.ModifiedBy,
                CreatedBy = x.CreatedBy,
                StatusTitle = (x.Status == 1 ? "Sử dụng" : x.Status == 2 ? "Không sử dụng" : "")
            }).SingleOrDefault(x => x.ID == id);
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
                if (getNotExistsCityWhenInsert(item.City))
                {
                    if (files == null)
                    {
                        item.FileName = null;
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
                    item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.CreatedDate = DateTime.Now;
                    item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.ModifiedDate = DateTime.Now;
                    _dbContext.Directory_City.Add(item);
                    _dbContext.SaveChanges();

                    msg.Title = City_Message_InsertSuccess;
                }
                else
                {
                    msg.Title = City_Message_ExistsedCity;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = City_Message_InsertErrror;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.import)]
        public object InsertImport(List<Directory_City> file)
        {
            Message msg = new Message { Error = false };
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    List<Directory_City> parameter = JsonConvert.DeserializeObject<List<Directory_City>>(Request.Form["file"]);
                    foreach(var item in parameter)
                    {
                        item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.CreatedDate = DateTime.Now;
                        item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.ModifiedDate = DateTime.Now;
                    }
                    
                    _dbContext.Directory_City.AddRange(parameter);
                    _dbContext.SaveChanges();
                    dbTran.Commit();
                    msg.Title = City_Message_InsertImportSuccess;
                }
                catch (Exception ex)
                {
                    msg.Title = City_Message_InsertImportErrror;
                    msg.Error = true;
                    msg.Data = ex.ToString();
                    dbTran.Rollback();
                }
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object Update(List<FileModel> files, Directory_City item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (getNotExistsCityWhenUpdate(item.ID, item.City))
                {
                    if (files == null)
                    {
                        files = new List<FileModel>();
                    }
                    _dbContext.Directory_City.Add(item);

                    _dbContext.Entry(item).State = EntityState.Modified;
                    if (files.Count > 0)
                    {
                        // trường hợp chưa có file và thêm mới file
                        foreach (var file in files)
                        {
                            var filecontent = file.contentAsBase64String;
                            var filetype = file.contentType;
                            var filename = file.fileName;
                            var bytes = Convert.FromBase64String(filecontent);
                            item.Attach = bytes;
                            item.FileName = file.fileName;
                        }
                    }
                    else if (item.FileName == null && files.Count == 0)
                    {
                        // trường hợp xóa file đã tồn tại và không thêm file mới vào
                        item.FileName = null;
                        item.Attach = null;
                    }
                    else if (item.FileName != null && files.Count == 0)
                    {
                        // trường hợp không thay đổi gì cả
                        _dbContext.Entry(item).Property(x => x.Attach).IsModified = false;
                        _dbContext.Entry(item).Property(x => x.FileName).IsModified = false;
                    }
                    _dbContext.Entry(item).Property(x => x.ID).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.History).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.CreatedBy).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.CreatedDate).IsModified = false;
                    item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.ModifiedDate = DateTime.Now;
                    _dbContext.SaveChanges();

                    msg.Title = City_Message_UpdateSuccess;
                }
                else
                {
                    msg.Title = City_Message_ExistsedCity;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = City_Message_UpdateError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object Delete(int id)
        {
            Message msg = new Message { Error = false };
            try
            {

                Directory_City item = _dbContext.Directory_City.SingleOrDefault(x => x.ID == id);
                if (item != null)
                {
                    _dbContext.Directory_City.Remove(item);
                    _dbContext.SaveChanges();
                    msg.Title = City_Message_DeleteSuccess;
                }
                else
                {
                    msg.Title = City_Message_NotExistItem;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = City_Message_DeleteSuccess;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object DeleteArray(List<int> idArray)
        {
            Message msg = new Message { Error = false };
            try
            {

                List<Directory_City> arrayDelete = new List<Directory_City>();
                foreach (var item in idArray)
                {
                    arrayDelete.Add(_dbContext.Directory_City.SingleOrDefault(x => x.ID == item));
                }

                _dbContext.Directory_City.RemoveRange(arrayDelete);
                _dbContext.SaveChanges();
                msg.Title = City_Message_DeleteListSuccess;
            }
            catch (Exception ex)
            {
                msg.Title = City_Message_DeleteListError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.export)]
        public FileResult Download(int id)
        {
            var infoOfFile = _dbContext.Directory_City.Select(x => new { x.ID, x.Attach, x.FileName }).FirstOrDefault(x => x.ID == id);
            if (infoOfFile.FileName != null && infoOfFile.Attach != null)
            {
                byte[] contents = infoOfFile.Attach;
                return File(infoOfFile.Attach, "application/xlsx", infoOfFile.FileName);
            }
            return null;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column city
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsCityWhenInsert(string id)
        {
            var result = _dbContext.Directory_City.Count(x => x.City == id.Trim());
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column city
        /// </summary>
        /// <param name="id"></param>
        /// <param name="city"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsCityWhenUpdate(int id, string city)
        {
            var result = _dbContext.Directory_City.Count(x => x.City == city.Trim() && x.ID != id);
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column city
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsCityWhenInsert(string id)
        {
            var result = _dbContext.Directory_City.Count(x => x.City == id.Trim());
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column city
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsCityWhenUpdate(int id, string city)
        {
            var result = _dbContext.Directory_City.Count(x => x.City == city.Trim() && x.ID != id);
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// check exists city code in table City
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByCity(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_City.Count(x => x.City == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
        /// <summary>
        /// check exists title code in table City
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByTitle(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_City.Count(x => x.Title == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
    }
}