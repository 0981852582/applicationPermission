using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using ApplicationWebiste.Models.DataTable;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApplicationWebiste.Controllers.Manager_Permission
{
    [ExistsLogin]
    public class ManagerFunctionController : Controller
    {
        dbContext _dbContext = new dbContext();
        public const string Function_Message_InsertSuccess = "Thêm mới chức năng thành công";
        public const string Function_Message_InsertErrror = "Thêm mới chức năng không thành công";
        public const string Function_Message_InsertImportSuccess = "Thêm mới chức năng bằng file thành công";
        public const string Function_Message_InsertImportErrror = "Thêm mới chức năng bằng file không thành công";
        public const string Function_Message_UpdateSuccess = "Cập nhật chức năng thành công";
        public const string Function_Message_UpdateError = "Cập nhật chức năng không thành công";
        public const string Function_Message_DeleteSuccess = "Xóa chức năng thành công";
        public const string Function_Message_NotExistItem = "chức năng không tồn tại";
        public const string Function_Message_ExistsedCity = "Mã chức năng đã tồn tại";
        public const string Function_Message_DeleteError = "Xóa chức năng không thành công";
        public const string Function_Message_DeleteListSuccess = "Xóa danh sách chức năng thành công";
        public const string Function_Message_DeleteListError = "Xóa danh sách chức năng không thành công";
        // GET: ManagerFunction
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object DataTable(DataTable parameter)
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
        public class FileModel
        {
            public string contentType { get; set; }

            public string contentAsBase64String { get; set; }

            public string fileName { get; set; }
        }

        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public object Insert(List<FileModel> files, function item, Function_Extend itemExtend)
        {
            Message msg = new Message { Error = false };
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    if (getNotExistsFunctionWhenInsert(item.Function1))
                    {
                        item.CreatedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.CreatedDate = DateTime.Now;
                        item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.ModifiedDate = DateTime.Now;
                        if (item.functionCategories != null)
                        {
                            item.functionCategoriesTitle = _dbContext.functionCategories.First(x => x.functionCategories == item.functionCategories).functionCategoriesTitle;
                        }
                        _dbContext.functions.Add(item);
                        _dbContext.SaveChanges();
                        msg.Title = Function_Message_InsertSuccess;
                        var ChildFunction = _dbContext.childOfFunctions.ToList();
                        foreach (var itemChild in ChildFunction)
                        {
                            if (itemExtend.ArrayFunction != null)
                            {
                                if (itemExtend.ArrayFunction.Find(x => x == itemChild.ChildOfFunction1) == null)
                                {
                                    itemChild.RemoveFunction += "#" + itemExtend.Function1 + "#";
                                    _dbContext.Entry(itemChild).Property(x => x.ID).IsModified = false;
                                    _dbContext.Entry(itemChild).Property(x => x.Title).IsModified = false;
                                    _dbContext.Entry(itemChild).Property(x => x.Order).IsModified = false;
                                    _dbContext.SaveChanges();
                                }
                            }

                        }
                        dbTran.Commit();
                    }
                    else
                    {
                        msg.Title = Function_Message_InsertErrror;
                        msg.Error = true;
                        dbTran.Rollback();
                    }
                }
                catch (Exception ex)
                {
                    msg.Title = Function_Message_InsertErrror;
                    msg.Error = true;
                    msg.Data = ex.ToString();
                    dbTran.Rollback();
                }

            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [DataAccess(Function = FunctionNameOfSql.manager_city, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public object Update(List<FileModel> files, function item, Function_Extend itemExtend)
        {
            Message msg = new Message { Error = false };
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    if (getNotExistsFunctionWhenInsert(item.Function1))
                    {
                        _dbContext.Entry(item).State = EntityState.Modified;
                        item.ModifiedBy = ((account)Session["informationOfAccount"]).Account1;
                        item.ModifiedDate = DateTime.Now;
                        if (item.functionCategories != null)
                        {
                            item.functionCategoriesTitle = _dbContext.functionCategories.First(x => x.functionCategories == item.functionCategories).functionCategoriesTitle;
                        }
                        _dbContext.Entry(item).Property(x => x.History).IsModified = false;
                        _dbContext.Entry(item).Property(x => x.CreatedBy).IsModified = false;
                        _dbContext.Entry(item).Property(x => x.CreatedDate).IsModified = false;
                        _dbContext.SaveChanges();
                        msg.Title = Function_Message_InsertSuccess;
                        var RemoveFunctionBefore = _dbContext.childOfFunctions.Where(x => x.RemoveFunction.Contains("#" + itemExtend.Function1 + "#")).ToList();
                        if(RemoveFunctionBefore != null)
                        {
                            foreach(var itemChildRemove in RemoveFunctionBefore)
                            {
                                itemChildRemove.RemoveFunction = itemChildRemove.RemoveFunction.Replace("#" + itemExtend.Function1 + "#","");
                                _dbContext.Entry(itemChildRemove).Property(x => x.Title).IsModified = false;
                                _dbContext.Entry(itemChildRemove).Property(x => x.ChildOfFunction1).IsModified = false;
                                _dbContext.Entry(itemChildRemove).Property(x => x.Order).IsModified = false;
                                _dbContext.SaveChanges();
                            }
                        }
                        var ChildFunction = _dbContext.childOfFunctions.ToList();
                        foreach (var itemChild in ChildFunction)
                        {
                            if (itemExtend.ArrayFunction != null)
                            {
                                if (itemExtend.ArrayFunction.Find(x => x == itemChild.ChildOfFunction1) == null)
                                {
                                    itemChild.RemoveFunction += "#" + itemExtend.Function1 + "#";
                                    _dbContext.Entry(itemChild).Property(x => x.ID).IsModified = false;
                                    _dbContext.Entry(itemChild).Property(x => x.Title).IsModified = false;
                                    _dbContext.Entry(itemChild).Property(x => x.Order).IsModified = false;
                                    _dbContext.SaveChanges();
                                }
                            }

                        }
                        dbTran.Commit();
                    }
                    else
                    {
                        msg.Title = Function_Message_InsertErrror;
                        msg.Error = true;
                        dbTran.Rollback();
                    }
                }
                catch (Exception ex)
                {
                    msg.Title = Function_Message_InsertErrror;
                    msg.Error = true;
                    msg.Data = ex.ToString();
                    dbTran.Rollback();
                }

            }
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object GetItem(int id)
        {
            var result = _dbContext.functions.Select(x => new Function_Extend
            {
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                ModifiedBy = x.ModifiedBy,
                ModifiedDate = x.ModifiedDate,
                ID = x.ID,
                Title = x.Title,
                Function1 = x.Function1,
                functionCategories = x.functionCategories,
                Url = x.Url,
                functionCategoriesTitle = x.functionCategoriesTitle
            }).FirstOrDefault(x => x.ID == id);

            if (result != null)
            {
                result.ArrayFunction = _dbContext.childOfFunctions.Where(x => x.RemoveFunction.Contains("#" + result.Function1 + "#")).Select(x => x.ChildOfFunction1).ToList();
            }
            if (result.ArrayFunction == null)
            {
                result.ArrayFunction = new List<string>();
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// kiểm tra xem đã tồn tại functionCategories
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_function, childOfFunction = ChildOfFunctionNameOfSql.add)]
        public bool getNotExistsFunctionWhenInsert(string id)
        {
            var result = _dbContext.functions.Count(x => x.functionCategories == id.Trim());
            if (result > 0)
            {
                return false;
            }
            return true;
        }
    }
}