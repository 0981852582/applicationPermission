//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ApplicationWebiste.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Directory_District
    {
        public int ID { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Nullable<byte> Status { get; set; }
        public string History { get; set; }
        public string FileName { get; set; }
        public byte[] Attach { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
    
        public virtual Directory_City Directory_City { get; set; }
    }
}
