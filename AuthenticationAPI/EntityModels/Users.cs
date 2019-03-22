using System.ComponentModel.DataAnnotations;

namespace AuthenticationAPI.EntityModels
{
        public class Users
        {
        [Key]
        public int User_ID { get; set; }

        [EmailAddress]
        [Required]
        public string Email{ get; set; }

        [Required]
        public string Password { get; set; }

        [MaxLength(128)]
        public string Salt { get; set; }
        }
}