using ApplicationWebiste.Models;
using ApplicationWebiste.Models.Custom_Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace ApplicationWebiste.Controllers
{
    [ExistsLogin]
    public class ManagerPermissionOfAccountController : Controller
    {
        dbContext _dbContext = new dbContext();
        dbContext _dbContextSecond = new dbContext();
        // GET: ManagerPermission
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public ActionResult Index()
        {
            // Lấy ra danh sách Những quyền nào trong Function account có quyền.
            ViewBag.ChildOfFunction = GetFunctionOfPagePermission.GetChildOfFunctionPagePermission(_dbContext, ((account)Session["informationOfAccount"]).Account1, FunctionNameOfSql.manager_permissionOfGroup);
            // return ra view
            return View();
        }
        /// <summary>
        /// Get Structure Tree Of Group
        /// </summary>
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object G_getAllGroupPermission()
        {
            // get data from table group in database to struture of tree js
            var data = _dbContext.groups.Select(x => new
            {
                groupId = x.Group1,
                name = x.Title,
                text = x.Name,
                id = x.ID,
                // get structure of group SO not have parent id
                parent_id = "0",
            }).ToList();
            // return result datatype json
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Get Structure Tree Of Function
        /// </summary>
        /// 
        public class C_treeOfFunctionPermission
        {
            public bool? isRootTree { get; set; }
            public string name { get; set; }
            public string text { get; set; }
            public string id { get; set; }
            public string parent_id { get; set; }
            public List<C_treeOfFunctionFillStringArray> arrayChildren { get; set; }
            public List<C_treeOfFunctionPermission> children { get; set; }
            public C_treeOfFunctionSelected state { get; set; }
            public string Url { get; set; }
            public byte? Order { get; set; }
        }
        public class C_treeOfFunctionSelected
        {
            public bool? opened { get; set; }
            public bool? selected { get; set; }
        }
        public class C_treeOfFunctionFillStringArray
        {
            public string name { get; set; }
        }
        public class C_parameterGetAllFunctionPermission
        {
            public string Account { get; set; }
        }
        public class C_parameterUpdatePermisstion
        {
            public string Account { get; set; }
            public string Function { get; set; }
            public string ChildOfFunction { get; set; }
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object UpdatePermisstion(List<C_parameterUpdatePermisstion> parameter)
        {
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    List<contraint_account_function_childOfFunction> listUpdate = new List<contraint_account_function_childOfFunction>();
                    var index = 0;
                    foreach (var item in parameter)
                    {
                        if (index == 0)
                        {
                            var deleteBefore = _dbContextSecond.contraint_account_function_childOfFunction.Where(x => x.Account == item.Account).ToList();
                            _dbContextSecond.contraint_account_function_childOfFunction.RemoveRange(deleteBefore);
                            _dbContextSecond.SaveChanges();
                        }
                        if (item.ChildOfFunction != null && item.Function != null)
                        {
                            listUpdate.Add(new contraint_account_function_childOfFunction
                            {
                                ChildOfFunction = item.ChildOfFunction,
                                Account = item.Account,
                                Function = item.Function
                            });
                        }
                        index++;
                    }

                    _dbContext.contraint_account_function_childOfFunction.AddRange(listUpdate);
                    _dbContext.SaveChanges();
                    dbTran.Commit();
                }
                catch (Exception ex)
                {
                    dbTran.Rollback();
                }
            }

            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object G_getAllFunctionPermission(C_parameterGetAllFunctionPermission parameter)
        {
            var itemGroup = _dbContext.contraint_account_group.FirstOrDefault(x => x.Account == parameter.Account);
            var Group = "";
            if (itemGroup != null)
            {
                Group = itemGroup.Group;
            }
            // auto id auto incream
            var autoNumber = 10000000;
            // get data from table group in database to struture of tree js
            var data = _dbContext.functions.Select(x => new C_treeOfFunctionPermission
            {
                name = x.Function1,
                text = x.Title,
                id = x.Function1,
                parent_id = x.Parent,
                Url = x.Url,
                isRootTree = true,
                arrayChildren = _dbContext.contraint_group_function_childOfFunction.Where(child => child.Function == x.Function1 && child.Group == Group).Select(child => new C_treeOfFunctionFillStringArray
                {
                    name = child.ChildOfFunction
                }).ToList(),
            }).Where(x => x.Url != null && x.Url != "").ToList();
            var dataOfAccount = _dbContext.contraint_account_function_childOfFunction.Select(x => new
            {
                Account = x.Account,
                Funciton = x.Function,
                childOfFunction = x.ChildOfFunction
            }).Where(x =>
                x.Account == parameter.Account
            ).ToList();
            // get all table childOfFunction in database
            var a_getallChildOfFunction = _dbContext.childOfFunctions.Select(x => new C_treeOfFunctionPermission
            {
                name = x.ChildOfFunction1,
                text = x.Title,
                id = "isNull",
                parent_id = "isNull",
                isRootTree = false,
                Order = x.Order
            }).OrderBy(x => x.Order).ToList();
            foreach (var item in data)
            {
                if (item.children == null)
                {
                    item.children = new List<C_treeOfFunctionPermission>();
                }
                foreach (var child in a_getallChildOfFunction)
                {
                    var existsItem = item.arrayChildren.Find(x => x.name == child.name);
                    if (existsItem == null)
                    {
                        item.children.Add(new C_treeOfFunctionPermission
                        {
                            name = child.name,
                            text = child.text,
                            id = autoNumber.ToString(),
                            parent_id = item.id,
                            isRootTree = false,
                            state = new C_treeOfFunctionSelected
                            {
                                selected = false
                            }
                        });
                        autoNumber++;
                    }
                }
            }
            foreach (var item in dataOfAccount)
            {
                var ExistsItem = data.Find(x => x.name == item.Funciton);
                if (ExistsItem != null)
                {
                    var ExistsItemChildren = ExistsItem.children.Find(x => x.name == item.childOfFunction);
                    if (ExistsItemChildren != null)
                    {
                        ExistsItemChildren.state.selected = true;
                        //ExistsItem.children.Add(new C_treeOfFunctionPermission
                        //{
                        //    name = item.childOfFunction,
                        //    text = a_getallChildOfFunction.Find(x => x.name == item.childOfFunction).text,
                        //    id = autoNumber.ToString(),
                        //    parent_id = ExistsItem.id,
                        //    isRootTree = false,
                        //    state = new C_treeOfFunctionSelected
                        //    {
                        //        selected = true
                        //    }
                        //});
                    }
                    autoNumber++;
                }
            }
            // order by
            List<C_treeOfFunctionPermission> listAlterOrder = new List<C_treeOfFunctionPermission>();
            var index = 0;
            foreach (var item in data)
            {
                if (item.children.Count > 0 && item.children.Find(x => x.state.selected == true) == null)
                {
                    if (index == 0)
                    {
                        item.state = new C_treeOfFunctionSelected
                        {
                            opened = true
                        };
                        index++;
                    }
                    listAlterOrder.Add(item);
                };
            };
            foreach (var item in data)
            {
                if (item.children.Count > 0 && item.children.Find(x => x.state.selected == true) != null && item.children.Find(x => x.state.selected == false) != null)
                {
                    if (index == 0)
                    {
                        item.state = new C_treeOfFunctionSelected
                        {
                            opened = true
                        };
                        index++;
                    }
                    listAlterOrder.Add(item);
                };
            };
            foreach (var item in data)
            {
                if (index == 0)
                {
                    item.state = new C_treeOfFunctionSelected
                    {
                        opened = true
                    };
                    index++;
                }
                if (item.children.Count > 0 && item.children.Find(x => x.state.selected == false) == null)
                {
                    listAlterOrder.Add(item);
                };
            };
            // return result datatype json
            return Json(listAlterOrder, JsonRequestBehavior.AllowGet);
        }
        public class C_parameterAccountToFilter
        {
            public string group { get; set; }
            public string value { get; set; }
        }
        public class C_parameterAccountToGroup
        {
            public string group { get; set; }
            public string value { get; set; }

        }
        /// <summary>
        /// lấy danh sách account to điều kiện filter
        /// </summary>
        /// <returns></returns>
        ///
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object G_getAccountToFilter(C_parameterAccountToFilter parameter)
        {
            if (parameter.value == null) parameter.value = "";
            if (parameter.group == null) parameter.group = "all";
            var dataReturn = _dbContext.contraint_account_group.Where(x => x.Account.Contains(parameter.value) && (parameter.group == "all" ? 1 == 1 : x.Group == parameter.group)).Select(x => new
            {
                name = x.Account,
                text = x.Account,
                id = x.ID,
                parent_id = "0",
            }).ToList();
            return Json(dataReturn, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfAccount, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object G_getAccountToGroup(C_parameterAccountToGroup parameter)
        {
            if (parameter.value == null) parameter.value = "";
            if (parameter.group == null) parameter.group = "all";
            var dataReturn = _dbContext.contraint_account_group.Where(x => x.Account.Contains(parameter.value) && (parameter.group == "all" ? 1 == 1 : x.Group == parameter.group)).Select(x => new
            {
                name = x.Account,
                text = x.Account,
                id = x.ID,
                parent_id = "0",
            }).ToList();
            return Json(dataReturn, JsonRequestBehavior.AllowGet);
        }
    }
}