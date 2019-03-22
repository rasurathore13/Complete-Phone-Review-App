using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuthenticationAPI.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthenticationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JWTController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private UserContext db { get; set; }
        public JWTController(UserContext _db, IOptions<AppSettings> aps)
        {
            _appSettings = aps.Value;
            db = _db;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public ActionResult Register([FromBody] Users user)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("The submitted data is in invalid format");
            }

            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] saltByteText = new byte[96];
            rng.GetBytes(saltByteText);

            user.Salt = Convert.ToBase64String(saltByteText);

            string PasswordWithSalt = user.Password + user.Salt;

            HashAlgorithm algorithm = new SHA256Managed();
            user.Password = Convert.ToBase64String(algorithm.ComputeHash(
                Encoding.UTF8.GetBytes(PasswordWithSalt)));

            if(db.GetUser.FirstOrDefault(x => x.Email == user.Email) != null)
            {
                return BadRequest("User already Exists");
            }
            db.Add(user);
            db.SaveChanges();
            
            user.Password = "";
            user.Salt = "";
            return Ok(user);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Token")]
        public ActionResult<string> Token([FromBody] Users user)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest("The submitted data is in invalid format");
            }
            Users UserDetails = db.GetUser.FirstOrDefault(x => x.Email == user.Email);
            if(UserDetails != null)
            {
                string SubmittedPasswordWithSalt = user.Password + UserDetails.Salt;
                HashAlgorithm algorithm = new SHA256Managed();
                string HashedPassword = Convert.ToBase64String(algorithm.ComputeHash(
                    Encoding.UTF8.GetBytes(SubmittedPasswordWithSalt)));

                if(HashedPassword == UserDetails.Password)
                {
                    
                    //Generating JWT 
                    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                    byte[] key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                    Claim[] claims = new Claim[] {new Claim( "User_ID", UserDetails.User_ID.ToString())};
                    var TokenDescriptor = new JwtSecurityToken(
                        issuer: "mysite.com",
                        audience: "yoursite.com",
                        claims: claims,
                        expires: DateTime.UtcNow.AddDays(3),
                        notBefore: DateTime.UtcNow,           
                        signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    );
                    var token = tokenHandler.WriteToken(TokenDescriptor);

                    //Another way of Generating JWT
                    // var tokenHandler = new JwtSecurityTokenHandler();
                    // byte[] key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                    // var tokenDescriptor = new SecurityTokenDescriptor
                    // {
                    //     Subject = new ClaimsIdentity(new Claim[] 
                    //     {
                    //         new Claim(ClaimTypes.Name, user.ID.ToString())
                    //     }),
                    //     Expires = DateTime.UtcNow.AddHours(3),
                    //     SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    // };
                    // var token = tokenHandler.CreateToken(tokenDescriptor);

                    return token;

                }
                else
                {
                    return BadRequest("The credentials Don't Match");
                }
            }
            else
            {
                return NotFound("The provided credentials does not exist.");
            }
        }

    }
}
