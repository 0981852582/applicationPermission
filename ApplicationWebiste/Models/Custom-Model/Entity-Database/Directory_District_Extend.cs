using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class Directory_District_Extend : Directory_District
    {
        public string TitleCity { get; set; }
        public string CreatedDateOfString { get { return (CreatedDate == null ? null : Convert.ToDateTime(CreatedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string ModifiedDateOfString { get { return (ModifiedDate == null ? null : Convert.ToDateTime(ModifiedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string StatusTitle { get; set; }
    }
}