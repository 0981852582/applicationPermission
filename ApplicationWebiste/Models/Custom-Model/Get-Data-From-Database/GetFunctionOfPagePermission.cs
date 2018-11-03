using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace ApplicationWebiste.Models.Custom_Model
{
    /// <summary>
    /// Khi vào page thì check xem account có những quyền nào trong page.
    /// </summary>
    /// 
  
    public class GetFunctionOfPagePermission
    {
        /// <summary>
        /// hàm này trả về một danh sách những childOfFuntion của Function đã tồn tại đẩy ra view để check permisstion trên view
        /// </summary>
        /// <param name="_dbContext"></param>
        /// <param name="Account"></param>
        /// <param name="Function"></param>
        /// <returns>List<string></returns>
        public static string GetChildOfFunctionPagePermission(dbContext _dbContext, string Account,string Function)
        {
            var stringQuery = string.Format("EXEC [P_viewPagePermission] '{0}','{1}'", Account, Function);
            var dataReturn = _dbContext.Database.SqlQuery<string>(stringQuery).ToList();
            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(dataReturn);
            return json;
        }
    }
}