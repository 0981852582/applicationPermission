using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.Custom_Model
{
    /// <summary>
    /// lấy vị trí của bản ghi trong table hiển thị ra table trên giao diện
    /// </summary>
    public class Message_Count_Item_On_Table
    {
        // khai báo chuỗi khi total bản ghi lớn hơn 0
        public const string Title = "{0} tới {1} trong tổng {2} bản ghi.";
        // khai báo chuỗi khi total là không có bản ghi nào
        public const string TitleEmpty = "0 bản ghi";
        public static string createMessage(int skip, int top, int total)
        {
            // trường hợp không có bản ghi nào
            if (total == 0)
            {
                return string.Format(TitleEmpty);
            }
            // trường hợp là page cuối cùng top có khả năng lớn hơn total nên chỉ lấy đến total
            if (top + skip > total)
            {
                return string.Format(Title, skip, total, total);
            }
            // trường họp có bản ghi
            else
            {
                return string.Format(Title, skip, skip + top - 1, total);
            }
        }
    }
}