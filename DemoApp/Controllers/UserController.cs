using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using demoapp.Model;
using demoapp.Services;
using demoapp.SettingConfig;

namespace demoapp.Controllers
{
    [Authorize]
    // [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private IConfiguration configuration;
        public UserController(IConfiguration iConfig)
        {
            configuration = iConfig;
        }
        
        [AllowAnonymous]
        [HttpPost("[action]")]
        // public JsonResult Login([FromBody]JObject args)
        public JsonResult Login([FromBody]JObject args)
        {

            UserService us = new UserService();

            UserModelArgs _args = new UserModelArgs();
            _args.USER_ID = JObject.Parse(args["body"].ToString())["user_id"].ToString();
            _args.PASSWORD = JObject.Parse(args["body"].ToString())["password"].ToString();
            _args.LANG = "KOR"; //JObject.Parse(args["body"].ToString())["lang_id"].ToString();
            // _args.IP = _accessor.HttpContext.Connection.RemoteIpAddress.ToString();
            
            UserModel _user = us.Authenticate(_args);

            JObject obj = new JObject();

            if(_user.ERR != null && _user.ERR != "")
            {
                obj["status"] = "FAIL";
                obj["msg"] = _user.ERR;
                return Json(obj);
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings").GetSection("Secret").Value);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Issuer = ConnectionUrl.URL,
                Audience = ConnectionUrl.URL,
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, _user.ID),
                    new Claim("NAME", _user.NAME),
                    new Claim("AUTH", _user.AUTH),
                    new Claim("DEPT", _user.DEPT_NAME)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
        
            obj["status"] = "SUCCESS";
            obj["msg"] = tokenString;
            return Json(obj);
        }

        [HttpPost("[action]")]
        public string SetTest()
        {
            return "HelloWorld!";
        }
    }
}