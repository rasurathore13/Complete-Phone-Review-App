using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using API.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FetchUserController : ControllerBase
    {
        private UserContext db; 

        public FetchUserController(UserContext _db)
        {
            db = _db;
        }

        [HttpGet]
        [Authorize]
        [Route("GetUserDetails")]
        public ActionResult<User> GetUserDetails([FromHeader] string Authorization)
        {
            JwtSecurityToken token = new JwtSecurityToken(Authorization.Split(' ')[1]);
            int User_ID;
            try
            {
                User_ID = Convert.ToInt32(token.Claims.First().Value);
            }
            catch(Exception)
            {   
                return Unauthorized();
            }
            User user = db.Users.Where(x => x.User_ID == User_ID).FirstOrDefault();
            if(user != null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound("The user could not be found");
            }
        }

        [HttpPost]
        [Authorize]
        [Route("SubmitUserDetails")]
        public ActionResult<User> SubmitUserDetails([FromBody] User user)
        {
            db.Users.Update(user);
            db.SaveChanges();
            return Ok("Your details were Updated");
            
        }

        [HttpPost]
        [Authorize]
        [Route("CreateUser")]
        public ActionResult<User> CreateUser([FromBody] User user) 
        {
            db.Users.Add(user);
            db.SaveChanges();
            return CreatedAtAction("CreateUser", user);
        }
        
        [HttpGet]
        [Authorize]
        [Route("IsUserAdmin")]
        public ActionResult IsUserAdmin([FromHeader] string Authorization)
        {
            string JWTAccessToken = Authorization.Split(' ')[1];
            JwtSecurityToken token = new JwtSecurityToken(JWTAccessToken);
            int User_ID = Convert.ToInt32(token.Claims.First().Value);
            User user = db.Users.FirstOrDefault(x => x.User_ID == User_ID);
            if(user != null && (user.Is_Admin != null && user.Is_Admin != 0) && (user.Is_Admin == 1))
            {
                return Ok();
            }
            else 
            {
                return Unauthorized();
            }
        }
    }
}
