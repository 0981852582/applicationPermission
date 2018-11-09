using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.DataTable
{
    // paramter đầu vào của table trên view gửi xuống
    public class DataTable
    {
        public int skip { get; set; }
        public int top { get; set; }
        public string orderBy { get; set; } = "Title";
        public bool orderType { get; set; } = true;
        public string search { get; set; }
    }
}