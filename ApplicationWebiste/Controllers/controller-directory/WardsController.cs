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
    //[ExistsLogin]
    public class WardsController : Controller
    {
        dbContext _dbContext = new dbContext();
        dbContext _dbContextQuery = new dbContext();
        public const string Wards_Message_InsertSuccess = "Thêm mới (Phường / Xã) thành công";
        public const string Wards_Message_InsertErrror = "Thêm mới (Phường / Xã) không thành công";
        public const string Wards_Message_InsertImportSuccess = "Thêm mới (Phường / Xã) bằng file thành công";
        public const string Wards_Message_InsertImportErrror = "Thêm mới (Phường / Xã) bằng file không thành công";
        public const string Wards_Message_UpdateSuccess = "Cập nhật (Phường / Xã) thành công";
        public const string Wards_Message_UpdateError = "Cập nhật (Phường / Xã) không thành công";
        public const string Wards_Message_DeleteSuccess = "Xóa (Phường / Xã) thành công";
        public const string Wards_Message_NotExistItem = "(Phường / Xã) không tồn tại";
        public const string Wards_Message_ExistsedWards = "Mã (Phường / Xã) đã tồn tại";
        public const string Wards_Message_DeleteError = "Xóa (Phường / Xã) không thành công";
        public const string Wards_Message_DeleteListSuccess = "Xóa danh sách (Phường / Xã) thành công";
        public const string Wards_Message_DeleteListError = "Xóa danh sách (Phường / Xã) không thành công";
        // GET: Wards
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            // Lấy ra danh sách Những quyền nào trong Function account có quyền.
            ViewBag.ChildOfFunction = GetFunctionOfPagePermission.GetChildOfFunctionPagePermission(_dbContext, ((account)Session["informationOfAccount"]).Account1, FunctionNameOfSql.manager_Wards);
            // return ra view
            return View();
        }

        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object DataTable(DataTable parameter)
        {
            var count = _dbContext.Directory_Wards.Count(x =>
                parameter.search == null ? 1 == 1 : x.City.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Directory_City.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Directory_District.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Wards.Contains(parameter.search)
            );
            var data = _dbContext.Directory_Wards.Select(x => new
            {
                Id = x.ID,
                City = x.City,
                Wards = x.Wards,
                CityTitle = x.Directory_City.Title,
                DistrictTitle = x.Directory_District.Title,
                Title = x.Title,
                Description = x.Description,
                x.History
            }).
            Where(x =>
                parameter.search == null ? 1 == 1 : x.City.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.CityTitle.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.DistrictTitle.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Title.Contains(parameter.search) ||
                parameter.search == null ? 1 == 1 : x.Wards.Contains(parameter.search)
            ).OrderBy(parameter.orderBy, parameter.orderType).
            Skip(parameter.skip).
            Take(parameter.top).

            ToList();
            return Json(new { data = data, totalItem = count, location = Message_Count_Item_On_Table.createMessage(parameter.skip + 1, parameter.top, count) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object GetItem(int id)
        {
            var result = _dbContext.Directory_Wards.Select(x => new Directory_Wards_Extend
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                FileName = x.FileName,
                Status = x.Status,
                Wards = x.Wards,
                District = x.District,
                City = x.City,
                TitleCity = x.Directory_City.Title,
                TitleDistrict = x.Directory_District.Title,
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
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public object Insert(List<FileModel> files, Directory_Wards item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (getNotExistsWardsWhenInsert(item.Wards))
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
                    var getCityOfDistrict = _dbContextQuery.Directory_District.SingleOrDefault(x => x.District == item.District);
                    if (getCityOfDistrict != null)
                    {
                        item.City = getCityOfDistrict.City;
                    }
                    item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.CreatedDate = DateTime.Now;
                    item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.ModifiedDate = DateTime.Now;
                    _dbContext.Directory_Wards.Add(item);
                    _dbContext.SaveChanges();

                    msg.Title = Wards_Message_InsertSuccess;
                }
                else
                {
                    msg.Title = Wards_Message_ExistsedWards;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = Wards_Message_InsertErrror;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        public bool InsertCity(List<Directory_Wards_Extend> list)
        {
            try
            {
                List<Directory_City> listCity = new List<Directory_City>();
                List<string> listExists = new List<string>();
                foreach (var item in list)
                {
                    var arrayExists = listExists.FindIndex(x => x == item.City);
                    if (arrayExists == -1)
                    {
                        var exists = _dbContext.Directory_City.Count(x => x.City == item.City);
                        if (exists == 0)
                        {
                            listCity.Add(new Directory_City
                            {
                                City = item.City,
                                Title = item.TitleCity,
                                Status = 1,
                                CreatedBy = ((account)Session["informationOfAccount"]).Account1,
                                CreatedDate = DateTime.Now,
                                ModifiedBy = ((account)Session["informationOfAccount"]).Account1,
                                ModifiedDate = DateTime.Now
                            });
                            listExists.Add(item.City);
                        }
                        else
                        {
                            listExists.Add(item.City);
                        }
                    }

                }
                if (listCity.Count > 0)
                {
                    _dbContext.Directory_City.AddRange(listCity);
                    _dbContext.SaveChanges();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool InsertDistrict(List<Directory_Wards_Extend> list)
        {
            try
            {
                List<Directory_District> listDistrict = new List<Directory_District>();
                List<string> listExists = new List<string>();
                foreach (var item in list)
                {
                    var arrayExists = listExists.FindIndex(x => x == item.District);
                    if (arrayExists == -1)
                    {
                        var exists = _dbContext.Directory_District.Count(x => x.District == item.District);
                        if (exists == 0)
                        {
                            listDistrict.Add(new Directory_District
                            {
                                City = item.City,
                                District = item.District,
                                Title = item.TitleDistrict,
                                Status = 1,
                                CreatedBy = ((account)Session["informationOfAccount"]).Account1,
                                CreatedDate = DateTime.Now,
                                ModifiedBy = ((account)Session["informationOfAccount"]).Account1,
                                ModifiedDate = DateTime.Now
                            });
                            listExists.Add(item.District);
                        }
                        else
                        {
                            listExists.Add(item.District);
                        }
                    }

                }
                if (listDistrict.Count > 0)
                {
                    _dbContext.Directory_District.AddRange(listDistrict);
                    _dbContext.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        [HttpPost]
        //[DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.import)]
        public object InsertImport(List<Directory_Wards_Extend> file)
        {
            Message msg = new Message { Error = false };
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    List<Directory_Wards_Extend> parameterExtend = JsonConvert.DeserializeObject<List<Directory_Wards_Extend>>(Request.Form["file"]);
                    if (InsertCity(parameterExtend))
                    {
                        if (InsertDistrict(parameterExtend))
                        {
                            List<Directory_Wards> parameter = JsonConvert.DeserializeObject<List<Directory_Wards>>(Request.Form["file"]);
                            foreach (var item in parameter)
                            {
                                item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                                item.CreatedDate = DateTime.Now;
                                item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                                item.ModifiedDate = DateTime.Now;
                            }

                            _dbContext.Directory_Wards.AddRange(parameter);
                            _dbContext.SaveChanges();
                            dbTran.Commit();
                            msg.Title = Wards_Message_InsertImportSuccess;
                        }
                        else
                        {
                            msg.Title = Wards_Message_InsertImportErrror;
                            msg.Error = true;
                            dbTran.Rollback();
                        }
                    }
                    else
                    {
                        msg.Title = Wards_Message_InsertImportErrror;
                        msg.Error = true;
                        dbTran.Rollback();
                    }

                }
                catch (Exception ex)
                {
                    msg.Title = Wards_Message_InsertImportErrror;
                    msg.Error = true;
                    msg.Data = ex.ToString();
                    dbTran.Rollback();
                }
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object Update(List<FileModel> files, Directory_Wards item)
        {
            Message msg = new Message { Error = false };
            try
            {
                if (getNotExistsWardsWhenUpdate(item.ID, item.Wards))
                {
                    if (files == null)
                    {
                        files = new List<FileModel>();
                    }
                    _dbContext.Directory_Wards.Add(item);

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
                    var getCityOfDistrict = _dbContextQuery.Directory_District.SingleOrDefault(x => x.District == item.District);
                    if (getCityOfDistrict != null)
                    {
                        item.City = getCityOfDistrict.City;
                    }
                    _dbContext.Entry(item).Property(x => x.ID).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.History).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.CreatedBy).IsModified = false;
                    _dbContext.Entry(item).Property(x => x.CreatedDate).IsModified = false;
                    item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                    item.ModifiedDate = DateTime.Now;
                    _dbContext.SaveChanges();

                    msg.Title = Wards_Message_UpdateSuccess;
                }
                else
                {
                    msg.Title = Wards_Message_ExistsedWards;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = Wards_Message_UpdateError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object Delete(int id)
        {
            Message msg = new Message { Error = false };
            try
            {

                Directory_Wards item = _dbContext.Directory_Wards.SingleOrDefault(x => x.ID == id);
                if (item != null)
                {
                    _dbContext.Directory_Wards.Remove(item);
                    _dbContext.SaveChanges();
                    msg.Title = Wards_Message_DeleteSuccess;
                }
                else
                {
                    msg.Title = Wards_Message_NotExistItem;
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = Wards_Message_DeleteSuccess;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.delete)]
        public object DeleteArray(List<int> idArray)
        {
            Message msg = new Message { Error = false };
            try
            {

                List<Directory_Wards> arrayDelete = new List<Directory_Wards>();
                foreach (var item in idArray)
                {
                    arrayDelete.Add(_dbContext.Directory_Wards.SingleOrDefault(x => x.ID == item));
                }

                _dbContext.Directory_Wards.RemoveRange(arrayDelete);
                _dbContext.SaveChanges();
                msg.Title = Wards_Message_DeleteListSuccess;
            }
            catch (Exception ex)
            {
                msg.Title = Wards_Message_DeleteListError;
                msg.Error = true;
                msg.Data = ex.ToString();
            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.export)]
        public FileResult Download(int id)
        {
            var infoOfFile = _dbContext.Directory_Wards.Select(x => new { x.ID, x.Attach, x.FileName }).FirstOrDefault(x => x.ID == id);
            if (infoOfFile.FileName != null && infoOfFile.Attach != null)
            {
                byte[] contents = infoOfFile.Attach;
                return File(infoOfFile.Attach, "application/xlsx", infoOfFile.FileName);
            }
            return null;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_Wards
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsWardsWhenInsert(string id)
        {
            var result = _dbContext.Directory_Wards.Count(x => x.Wards == id.Trim());
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_Wards
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Wards"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getExistsWardsWhenUpdate(int id, string Wards)
        {
            var result = _dbContext.Directory_Wards.Count(x => x.Wards == Wards.Trim() && x.ID != id);
            if (result > 0)
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Directory_Wards
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsWardsWhenInsert(string id)
        {
            var result = _dbContext.Directory_Wards.Count(x => x.Wards == id.Trim());
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại mã tỉnh thành phố bằng column Wards
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_Wards, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public bool getNotExistsWardsWhenUpdate(int id, string Wards)
        {
            var result = _dbContext.Directory_Wards.Count(x => x.Wards == Wards.Trim() && x.ID != id);
            if (result > 0)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// check exists Wards code in table Wards
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByWards(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_Wards.Count(x => x.Wards == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
        public class ClassCountItemByWards
        {
            public string Ward { get;set; }
        }
        /// <summary>
        /// check exists Wards code in table Wards by array
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public object CountItemByWardsByArray(List<string> parameter)
        {
            List<string> result = new List<string>();
            if (parameter != null)
            {
                if(parameter[0] != null)
                {
                    result = JsonConvert.DeserializeObject<List<string>>(parameter[0]);
                }
            }
            
            List<string> resultExists = new List<string>();
            for (int i = 0; i < result.Count; i++)
            {
                if (result[i] != null)
                {
                    var strings = result[i];
                    var exists = _dbContext.Directory_Wards.Count(x => x.Wards == strings);
                    if (exists > 0)
                    {
                        resultExists.Add(result[i]);
                    }
                }
            }
            return Json(new { data = resultExists}, JsonRequestBehavior.AllowGet);

        }
        /// <summary>
        /// check exists title code in table Wards
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public int CountItemByTitle(string parameter)
        {
            if (parameter != null)
            {
                return _dbContext.Directory_Wards.Count(x => x.Title == parameter.Trim());
            }
            else
            {
                return 0;
            }
        }
        /// <summary>
        /// get lookup of Wards
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns>true false</returns>
        [HttpPost]
        public object GetLookupItem()
        {
            Message msg = new Message { Error = false };
            try
            {
                var result = _dbContext.Directory_Wards.Select(x => new
                {
                    LookupId = x.Wards,
                    LookupTitle = x.Title
                }).ToList();
                result.Insert(0, new
                {
                    LookupId = "",
                    LookupTitle = "Chọn (Phường / Xã)"
                });
                msg.Data = Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { Data = ex.ToString(), Error = true }, JsonRequestBehavior.AllowGet);
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
    }
}