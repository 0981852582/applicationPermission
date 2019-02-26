using System;
using System.Collections.Generic;

namespace ApplicationWebiste.Models.Custom_Model
{
    public class Function_Extend : function
    {
        public string CreatedDateOfString { get { return (CreatedDate == null ? null : Convert.ToDateTime(CreatedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public string ModifiedDateOfString { get { return (ModifiedDate == null ? null : Convert.ToDateTime(ModifiedDate).ToString("dd/MM/yyyy HH:mm:ss")); } }
        public List<string> ArrayFunction { get; set; }
    }
}