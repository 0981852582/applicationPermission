﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class dbContext : DbContext
    {
        public dbContext()
            : base("name=dbContext")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<account> accounts { get; set; }
        public virtual DbSet<childOfFunction> childOfFunctions { get; set; }
        public virtual DbSet<contraint_account_function_childOfFunction> contraint_account_function_childOfFunction { get; set; }
        public virtual DbSet<contraint_account_group> contraint_account_group { get; set; }
        public virtual DbSet<contraint_group_function_childOfFunction> contraint_group_function_childOfFunction { get; set; }
        public virtual DbSet<function> functions { get; set; }
        public virtual DbSet<group> groups { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
    }
}
