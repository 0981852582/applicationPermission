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
    public class ManagerPermissionOfGroupController : Controller
    {
        dbContext _dbContext = new dbContext();
        dbContext _dbContextSecond = new dbContext();
        // GET: ManagerPermission
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfGroup, childOfFunction = ChildOfFunctionNameOfSql.view)]
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
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfGroup, childOfFunction = ChildOfFunctionNameOfSql.view)]
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
            public string removeFunction { get; set; }
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
            public string Group { get; set; }
        }
        public class C_parameterUpdatePermisstion
        {
            public string Group { get; set; }
            public string Function { get; set; }
            public string ChildOfFunction { get; set; }
        }
        public string convertNullToString(string data)
        {
            if(data == null)
            {
                return string.Empty;
            }
            return data;
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfGroup, childOfFunction = ChildOfFunctionNameOfSql.edit)]
        public object UpdatePermisstion(List<C_parameterUpdatePermisstion> parameter)
        {
            using (DbContextTransaction dbTran = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    List<contraint_group_function_childOfFunction> listUpdate = new List<contraint_group_function_childOfFunction>();
                    var index = 0;
                    foreach (var item in parameter)
                    {
                        if (index == 0)
                        {
                            var deleteBefore = _dbContextSecond.contraint_group_function_childOfFunction.Where(x => x.Group == item.Group).ToList();
                            _dbContextSecond.contraint_group_function_childOfFunction.RemoveRange(deleteBefore);
                            _dbContextSecond.SaveChanges();
                        }
                        if (item.ChildOfFunction != null && item.Function != null)
                        {
                            listUpdate.Add(new contraint_group_function_childOfFunction
                            {
                                ChildOfFunction = item.ChildOfFunction,
                                Group = item.Group,
                                Function = item.Function
                            });
                        }
                        index++;
                    }

                    _dbContext.contraint_group_function_childOfFunction.AddRange(listUpdate);
                    _dbContext.SaveChanges();
                    dbTran.Commit();
                }
                catch (Exception)
                {
                    dbTran.Rollback();
                }
            }

            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [DataAccess(Function = FunctionNameOfSql.manager_permissionOfGroup, childOfFunction = ChildOfFunctionNameOfSql.view)]
        public object G_getAllFunctionPermission(C_parameterGetAllFunctionPermission parameter)
        {
            // auto id auto incream
            var autoNumber = 10000000;
            // get data from table group in database to struture of tree js
            var data = _dbContext.functions.Select(x => new C_treeOfFunctionPermission
            {
                name = x.Function1,
                text = x.Title,
                id = x.Function1,
                Url = x.Url,
                isRootTree = true,
                arrayChildren = _dbContext.contraint_group_function_childOfFunction.Where(child => child.Function == x.Function1 && child.Group == parameter.Group).Select(child => new C_treeOfFunctionFillStringArray
                {
                    name = child.ChildOfFunction
                }).ToList(),
            }).Where(x => x.Url != null && x.Url != "").ToList();
            // get all table childOfFunction in database
            var a_getallChildOfFunction = _dbContext.childOfFunctions.Select(x => new C_treeOfFunctionPermission
            {
                name = x.ChildOfFunction1,
                text = x.Title,
                id = "isNull",
                parent_id = "isNull",
                isRootTree = false,
                Order = x.Order,
                removeFunction = x.RemoveFunction
            }).OrderBy(x => x.Order).ToList();
            foreach (var item in data)
            {
                if (item.children == null)
                {
                    item.children = new List<C_treeOfFunctionPermission>();
                }
                foreach (var child in a_getallChildOfFunction)
                {
                    if (convertNullToString(child.removeFunction).IndexOf("#" + item.name + "#") == -1)
                    {
                        var existsItem = item.arrayChildren.Find(x => x.name == child.name);
                        item.children.Add(new C_treeOfFunctionPermission
                        {
                            name = child.name,
                            text = child.text,
                            id = autoNumber.ToString(),
                            parent_id = item.id,
                            isRootTree = false,
                            state = new C_treeOfFunctionSelected
                            {
                                selected = (existsItem != null ? true : false),
                            }
                        });
                    }
                    autoNumber++;
                }
            }
            // order by
            List<C_treeOfFunctionPermission> listAlterOrder = new List<C_treeOfFunctionPermission>();
            var index = 0;
            foreach (var item in data)
            {
                if (item.children.Find(x => x.state.selected == true) == null)
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
                if (item.children.Find(x => x.state.selected == true) != null && item.children.Find(x => x.state.selected == false) != null)
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
                if (item.children.Find(x => x.state.selected == false) == null)
                {
                    listAlterOrder.Add(item);
                };
            };
            // return result datatype json
            return Json(listAlterOrder, JsonRequestBehavior.AllowGet);
        }
    }
}