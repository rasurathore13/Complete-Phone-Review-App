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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FetchReviewsController : ControllerBase
    {

        private ReviewsContext db { get; set; }
        //private readonly IHttpClientFactory client;
        public FetchReviewsController(ReviewsContext _db) 
        {
            db = _db;
            //client =_client;
        }

        [HttpGet]
        [Route("GetReviewsByPhoneID")]
        public ActionResult<List<Reviews>> GetReviewsByPhoneID([FromQuery] int id)
        {
            return db.reviews.Where(x => x.Phone_ID == id).ToList();
        }

        [HttpPost]
        [Authorize]
        [Route("SubmitReviews")]
        public async Task<ActionResult<string>> SubmitReviews ([FromBody] JObject UserReview, [FromHeader] string Authorization, [FromQuery] int Phone_ID)
        {

            string ComprehendURL = "https://m0zc72xald.execute-api.us-east-1.amazonaws.com/ReviewSentimentAnalysis";
            string SentimentAnalysisResponse;
            string Sentiment;

            using(HttpClient client = new HttpClient())
            using(HttpRequestMessage request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(ComprehendURL);
                request.Content = new StringContent("{\"UserReview\":\"" + UserReview["UserReview"].ToString() + "\"}", Encoding.UTF8, "application/json");
                using(HttpResponseMessage response = await client.SendAsync(request).ConfigureAwait(false))
                {
                    SentimentAnalysisResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    Sentiment = JObject.Parse(SentimentAnalysisResponse)["Sentiment"].ToString(); 
                    
                }
            }

            int SentimentValue;

            if(Sentiment == "POSITIVE")
            {
                SentimentValue = 2;
            }
            else if(Sentiment == "MIXED" || Sentiment == "NEUTRAL")
            {
                SentimentValue = 1;
            }
            else 
            {
                SentimentValue = 0;
            }


            JwtSecurityToken token = new JwtSecurityToken(Authorization.Split(' ')[1]);
            Reviews review = new Reviews()
            {
                User_ID = Convert.ToInt32(token.Claims.First().Value),
                Phone_ID = Phone_ID,
                Review =  UserReview["UserReview"].ToString(),
                Date_Time_Of_Review = DateTime.UtcNow,
                Review_Sentiment = SentimentValue
            };
            try
            {
                db.Add(review);
                db.SaveChanges();
                return CreatedAtAction("SubmitReviews", review);
            }
            catch(Exception)
            {
                return BadRequest("There was an error while saving the review");
            }
        }
    }
}
