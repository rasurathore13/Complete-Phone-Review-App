using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using API.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FetchPhonesController : ControllerBase
    {

        private int NumberOfPhonesToReturnAtATime = 5;
        private PhoneContext db { get; set; }
        private UserContext dbu { get; set; }
        public FetchPhonesController(PhoneContext _db, UserContext _dbu)
        {
            db = _db;
            dbu = _dbu;
        }

        //The below action method is for situation when a new phone is added to the database and a user is viewing the page simuntaneouly
        //Here the variable 'Number' means the number of request that has been made to this API so far by a connected angular client
        [HttpGet]
        public ActionResult<List<Phones>> Get([FromQuery] int LatestPhoneID = 0, int Number = 0)
        {
            if(LatestPhoneID == 0 || Number == 0)
            {
                return null;
            }
            return Ok(db.GetPhones.OrderByDescending(x => x.Phone_Date_Of_Release)
                                .Where(x => x.Phone_ID <= LatestPhoneID)
                                .Skip((Number-1)*NumberOfPhonesToReturnAtATime)
                                .Take(NumberOfPhonesToReturnAtATime)
                                .ToList());
        }

        [HttpGet]
        [Route("GetLatestPhoneID")]
        public ActionResult<int> GetLatestPhoneID()
        {
            return Ok(db.GetPhones.OrderByDescending(x => x.Phone_ID).FirstOrDefault().Phone_ID);
        }

        [HttpGet]
        [Route("GetPhoneWithID")]
        public ActionResult<Phones> GetPhoneWithID([FromQuery] int id = 0)
        {
            if(id == 0)
            {
                return null;
            }
            return Ok(db.GetPhones.FirstOrDefault(x => x.Phone_ID == id));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("GetSearchedListOfPhones")]
        public ActionResult<List<Phones>> GetSearchedListOfPhones([FromBody] JObject data) 
        {
            var IdsOfSearchResults = data["idsOfSearchResults"];
            List<int> idsOfSearchResults = new List<int>();
            foreach(var ids in IdsOfSearchResults)
            {
                idsOfSearchResults.Add(Convert.ToInt32(ids));
            }
            List<Phones> unsortedResult = db.GetPhones.Where(x => idsOfSearchResults.Contains(x.Phone_ID)).ToList();
            List<Phones> sortedResult = new List<Phones>();
            foreach(int Phone_ID in IdsOfSearchResults)
            {
                foreach(Phones phone in unsortedResult)
                {
                    if(phone.Phone_ID == Phone_ID)
                    {
                        sortedResult.Add(phone);
                        break;
                    }
                }
            }
            return sortedResult;
        }

        [Authorize]
        [HttpPost]
        [Route("AddPhone")]
        public ActionResult<Phones> AddPhone([FromBody] Phones phone, [FromHeader] string Authorization) 
        {
            JwtSecurityToken token = new JwtSecurityToken(Authorization.Split(' ')[1]);
            User user = dbu.Users.FirstOrDefault(x => x.User_ID == Convert.ToInt32(token.Claims.First().Value));
            if(user == null || user.Is_Admin == null || user.Is_Admin == 0)
            {
                return Unauthorized();
            }
            if(db.GetPhones.FirstOrDefault(x => x.Phone_Name == phone.Phone_Name) != null)
            {
                return BadRequest("A Phone with same name already exists");
            }
            else 
            {
                try
                {
                    db.Add(phone);
                    db.SaveChanges();
                    return Ok(phone);
                }
                catch (Exception)
                {
                    return BadRequest("There was an error in saving that phone.");
                }
            }
        }
    }
}
