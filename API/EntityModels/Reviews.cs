using System;
using System.ComponentModel.DataAnnotations;

namespace API.EntityModels
{
    public class Reviews
    {
        [Key]
        public int Review_ID { get; set; }
        [Required]
        public int User_ID { get; set; }
        [Required]
        public int Phone_ID { get; set; }
        [Required]
        public string Review { get; set; }
        [Required]
        public int Review_Sentiment { get; set; }
        [Required]
        public DateTime Date_Time_Of_Review { get; set; }

    }
}