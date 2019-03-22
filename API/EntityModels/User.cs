using System;
using System.ComponentModel.DataAnnotations;

namespace API.EntityModels
{
    public class User
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public int User_ID { get; set; }
        [Required]
        public string Email { get; set; }
        
        public string Name { get; set; }
        
        public DateTime Date_Of_Birth { get; set; }
        
        public char Gender { get; set; }
        public string Display_Picture { get; set; }

        public int? Is_Admin { get; set; }

    }
}