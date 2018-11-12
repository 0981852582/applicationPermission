using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class Directory_City_Extend : Directory_City
    {
        public string CreatedDateOfString { get { return (CreatedDate == null ? null : Convert.ToDateTime(CreatedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string ModifiedDateOfString { get { return (ModifiedDate == null ? null : Convert.ToDateTime(ModifiedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string StatusTitle { get; set; }
    }
}