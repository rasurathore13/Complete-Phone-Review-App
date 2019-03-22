using System;
using System.ComponentModel.DataAnnotations;

namespace API
{
    public class Phones
    {
        [Key]
        public int Phone_ID { get; set; }
        [Required]
        public string Phone_Name { get; set; }
        public int? Phone_Front_Camera { get; set; }
        public int? Phone_Back_Camera { get; set; }
        public int? Phone_Screen { get; set; }
        public int? Phone_Battery { get; set; }
        public int? Phone_Speaker { get; set; }
        [Required]
        public DateTime Phone_Date_Of_Release { get; set; }
        [Required]
        public string Phone_Image_Link { get; set; }
        public string Phone_Details { get; set; }
    }
}