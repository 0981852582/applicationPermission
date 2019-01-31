using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class Directory_Wards_Extend : Directory_Wards
    {
        public string TitleCity { get; set; }
        public string TitleDistrict { get; set; }
        public string CreatedDateOfString { get { return (CreatedDate == null ? null : Convert.ToDateTime(CreatedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string ModifiedDateOfString { get { return (ModifiedDate == null ? null : Convert.ToDateTime(ModifiedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string StatusTitle { get; set; }
    }
}