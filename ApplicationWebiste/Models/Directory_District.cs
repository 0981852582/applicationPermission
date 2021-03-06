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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Directory_District()
        {
            this.Directory_Wards = new HashSet<Directory_Wards>();
        }
    
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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Directory_Wards> Directory_Wards { get; set; }
    }
}
