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
    
    public partial class function
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public function()
        {
            this.contraint_account_function_childOfFunction = new HashSet<contraint_account_function_childOfFunction>();
            this.contraint_group_function_childOfFunction = new HashSet<contraint_group_function_childOfFunction>();
        }
    
        public int ID { get; set; }
        public string Function1 { get; set; }
        public string Parent { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string History { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<contraint_account_function_childOfFunction> contraint_account_function_childOfFunction { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<contraint_group_function_childOfFunction> contraint_group_function_childOfFunction { get; set; }
    }
}
