using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApplicationWebiste.Models.Custom_Model
{
    /// <summary>
    /// class message
    /// </summary>
    public class Message
    {
        public string Title { get; set; }
        public bool? Error { get; set; }
        public object Data { get; set; }

        public Message()
        {
            this.Error = false;
        }
    }
}