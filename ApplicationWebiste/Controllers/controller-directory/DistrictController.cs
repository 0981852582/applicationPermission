using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using ApplicationWebiste.Models.DataTable;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace ApplicationWebiste.Controllers.Manager_Permission
{
    [ExistsLogin]
    public class DistrictController : Controller
    {
        dbContext _dbContext = new dbContext();
        public const string District_Message_InsertSuccess = "Thêm mới (Quận / Huyện) thành công";
        public const string District_Message_InsertErrror = "Thêm mới (Quận / Huyện) không thành công";
        public const string District_Message_InsertImportSuccess = "Thêm mới (Quận / Huyện) bằng file thành công";
        public const string District_Message_InsertImportErrror = "Thêm mới (Quận / Huyện) bằng file không thành công";
        public const string District_Message_UpdateSuccess = "Cập nhật (Quận / Huyện) thành công";
        public const string District_Message_UpdateError = "Cập nhật (Quận / Huyện) không thành công";
        public const string District_Message_DeleteSuccess = "Xóa (Quận / Huyện) thành công";
        public const string District_Message_NotExistItem = "(Quận / Huyện) không tồn tại";
        public const string District_Message_ExistsedDistrict = "Mã (Quận / Huyện) đã tồn tại";
        public const string District_Message_DeleteError = "Xóa (Quận / Huyện) không thành công";
        public const string District_Message_DeleteListSuccess = "Xóa danh sách (Quận / Huyện) thành công";
        public const string District_Message_DeleteListError = "Xóa danh sách (Quận / Huyện) không thành công";
        // GET: District
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            // Lấy ra danh sách Những quyền nào trong Function account có quyền.
            ViewBag.ChildOfFunction = GetFunctionOfPagePermission.GetChildOfFunctionPagePermission(_dbContext, ((account)Session["informationOfAccount"]).Account1, FunctionNameOfSql.manager_district);
            // return ra view
            return View();
        }

        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object DataTable(DataTable parameter)
        {
            var count = _dbContext.Directory_District.Count(x =>
                parameter.search == null ? 1 == 1 : x.City.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Directory_City.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.District.Contains(parameter.search)
            );
            var data = _dbContext.Directory_District.Select(x => new
            {
                Id = x.ID,
                City = x.City,
                District = x.District,
                CityTitle = x.Directory_City.Title,
                Title = x.Title,
                Description = x.Description,
                x.History
            }).
            Where(x =>
                parameter.search == null ? 1 == 1 : x.City.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.CityTitle.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.District.Contains(parameter.search)
            ).OrderBy(parameter.orderBy, parameter.orderType).
            Skip(parameter.skip).
            Take(parameter.top).

            ToList();
            return Json(new { data = data, totalItem = count, location = Message_Count_Item_On_Table.createMessage(parameter.skip + 1, parameter.top, count) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object GetItem(int id)
        {
            var result = _dbContext.Directory_District.Select(x => new Directory_District_Extend
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                FileName = x.FileName,
                Status = x.Status,
                District = x.District,
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
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public object Insert(List<FileModel> files, Directory_District item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (getNotExistsDistrictWhenInsert(item.District))
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
                    _dbContext.Directory_District.Add(item);
                    _dbContext.SaveChanges();

                    msg.Title = District_Message_InsertSuccess;
                }
                else
                {
                    msg.Title = District_Message_ExistsedDistrict;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = District_Message_InsertErrror;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.import)]
        public object InsertImport(List<Directory_District> file)
        {
            Message msg = new Message { Error = false };
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    List<Directory_District> parameter = JsonConvert.DeserializeObject<List<Directory_District>>(Request.Form["file"]);
                    foreach (var item in parameter)
                    {
                        item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.CreatedDate = DateTime.Now;
                        item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.ModifiedDate = DateTime.Now;
                    }

                    _dbContext.Directory_District.AddRange(parameter);
                    _dbContext.SaveChanges();
                    dbTran.Commit();
                    msg.Title = District_Message_InsertImportSuccess;
                }
                catch (Exception ex)
                {
                    msg.Title = District_Message_InsertImportErrror;
                    msg.Error = true;
                    msg.Data = ex.ToString();
                    dbTran.Rollback();
                }
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object Update(List<FileModel> files, Directory_District item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (getNotExistsDistrictWhenUpdate(item.ID, item.City))
                {
                    if (files == null)
                    {
                        files = new List<FileModel>();
                    }
                    _dbContext.Directory_District.Add(item);

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

                    msg.Title = District_Message_UpdateSuccess;
                }
                else
                {
                    msg.Title = District_Message_ExistsedDistrict;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = District_Message_UpdateError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object Delete(int id)
        {
            Message msg = new Message { Error = false };
            try
            {

                Directory_District item = _dbContext.Directory_District.SingleOrDefault(x => x.ID == id);
                if (item != null)
                {
                    _dbContext.Directory_District.Remove(item);
                    _dbContext.SaveChanges();
                    msg.Title = District_Message_DeleteSuccess;
                }
                else
                {
                    msg.Title = District_Message_NotExistItem;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = District_Message_DeleteSuccess;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object DeleteArray(List<int> idArray)
        {
            Message msg = new Message { Error = false };
            try
            {

                List<Directory_District> arrayDelete = new List<Directory_District>();
                foreach (var item in idArray)
                {
                    arrayDelete.Add(_dbContext.Directory_District.SingleOrDefault(x => x.ID == item));
                }

                _dbContext.Directory_District.RemoveRange(arrayDelete);
                _dbContext.SaveChanges();
                msg.Title = District_Message_DeleteListSuccess;
            }
            catch (Exception ex)
            {
                msg.Title = District_Message_DeleteListError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.export)]
        public FileResult Download(int id)
        {
            var infoOfFile = _dbContext.Directory_District.Select(x => new { x.ID, x.Attach, x.FileName }).FirstOrDefault(x => x.ID == id);
            if (infoOfFile.FileName != null && infoOfFile.Attach != null)
            {
                byte[] contents = infoOfFile.Attach;
                return File(infoOfFile.Attach, "application/xlsx", infoOfFile.FileName);
            }
            return null;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_District
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsDistrictWhenInsert(string id)
        {
            var result = _dbContext.Directory_District.Count(x => x.District == id.Trim());
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_District
        /// </summary>
        /// <param name="id"></param>
        /// <param name="district"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsDistrictWhenUpdate(int id, string district)
        {
            var result = _dbContext.Directory_District.Count(x => x.District == district.Trim() && x.ID != id);
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_District
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsDistrictWhenInsert(string id)
        {
            var result = _dbContext.Directory_District.Count(x => x.District == id.Trim());
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column District
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_district, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsDistrictWhenUpdate(int id, string district)
        {
            var result = _dbContext.Directory_District.Count(x => x.District == district.Trim() && x.ID != id);
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// check exists District code in table District
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByDistrict(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_District.Count(x => x.District == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
        /// <summary>
        /// check exists title code in table District
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByTitle(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_District.Count(x => x.Title == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
        /// <summary>
        /// get lookup of district
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public object GetLookupItem()
        {
            Message msg = new Message { Error = false };
            try
            {
                var result = _dbContext.Directory_District.Select(x => new
                {
                    LookupId = x.District,
                    LookupTitle = x.Title
                }).ToList();
                msg.Data = Json(result);
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Data = ex.ToString();
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
    }
}