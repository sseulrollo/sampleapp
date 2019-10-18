using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using demoapp.Model;
using demoapp.Services;
using demoapp.SettingConfig;

namespace demoapp.Controllers
{
    [Route("api/[controller]")]
    public class CommonController : Controller
    {
        private Dictionary<string, object> SettingParams(JObject json)
        {
            Dictionary<string, object> paramsDic =
                new Dictionary<string, object>();

            foreach (var item in json)
            {
                if (!paramsDic.ContainsKey(item.Key))
                    if (item.Key.StartsWith("@"))
                        paramsDic.Add(item.Key, item.Value.ToObject<dynamic>());
                    else if (item.Key.ToUpper().StartsWith("P_"))
                        paramsDic.Add("@" + item.Key, item.Value.ToObject<dynamic>());
                    else
                        paramsDic.Add("@P_" + item.Key, item.Value.ToObject<dynamic>());
            }

            return paramsDic;
        }


        [HttpPost("[action]")]
        [Description("Code Load 기능")]
        public JsonResult Code([FromBody]JObject args)
        {
            CodeRepo _codeRepo = new CodeRepo();
            // IList<CodeModel> _codeList;

            CodeModelArgs cm = new CodeModelArgs();
            cm.Gropu_Id = JObject.Parse(args["body"].ToString())["GroupId"].ToString();
            cm.Where = JObject.Parse(args["body"].ToString())["Where"].ToString();
            _codeRepo.SelectModels(cm);
            List<string> header = new List<string>();

            JObject sqlResult = MakeHeader.returnData(_codeRepo, ref header);

            return Json(sqlResult);
        }


        [HttpGet("[action]")]
        [Description("Code Load 기능")]
        public JsonResult CodeDynamic(string args)
        {
            CallDb callDb = new CallDb();

            JObject json = JObject.Parse(args);
            Dictionary<string, object> paramsDic = SettingParams(json);

            JObject sqlResult = callDb.LoadSqlSingle("pk_atm_sp_code", paramsDic);

            return Json(sqlResult);
        }

        [HttpGet("[action]")]
        [Description("Menu Load 기능")]
        public JsonResult Menu(MenuModelArgs args)
        {
            MenuRepo _menuRepo = new MenuRepo();
            IList<MenuModel> _menuList;

            _menuRepo.SelectModels(args);
            _menuList = _menuRepo.SelectedModels;

            return Json(_menuList);
        }


        [HttpPost("[action]")]
        [Description("Read 기능 / sql : sp명, args : json 타입의 parameter")]
        public JsonResult LoadSql([FromBody]JObject args)
        {
            CallDb callDb = new CallDb();

            string sql = JObject.Parse(args["body"].ToString())["sql"].ToString();
            string arg = Json(JObject.Parse(args["body"].ToString())["args"].ToString()).Value.ToString();

            arg = arg.Replace("\r\n", "").Replace(" ", "");

            JObject json = new JObject();
            if(arg != "[]" && arg != "{}")
                json = JObject.Parse(arg);

            Dictionary<string, object> paramsDic = SettingParams(json);

            string sqlResult = callDb.LoadSql(sql, paramsDic);

            return Json(sqlResult);
        }

        [HttpPost("[action]")]
        [Description("Read 기능")]
        public JsonResult LoadSqlSingle([FromBody]JObject args)
        {
            CallDb callDb = new CallDb();

            string sql = JObject.Parse(args["body"].ToString())["sql"].ToString();
            string arg = Json(JObject.Parse(args["body"].ToString())["args"].ToString()).Value.ToString();

            arg = arg.Replace("\r\n", "").Replace(" ", "");

            JObject json = new JObject();
            if(arg != "[]" && arg != "{}")
                json = JObject.Parse(arg);

            Dictionary<string, object> paramsDic = SettingParams(json);

            JObject sqlResult = callDb.LoadSqlSingle(sql, paramsDic);

            return Json(sqlResult);
        }


        [HttpPost("[action]")]
        [Description("CUD 기능 / sql : sp명, args : json 타입의 parameter")]
        public JsonResult ExecuteSql([FromBody]JObject args)
        {
            CallDb callDb = new CallDb();

            string sql = JObject.Parse(args["body"].ToString())["sql"].ToString();
            string arg = Json(JObject.Parse(args["body"].ToString())["args"].ToString()).Value.ToString();
            string saveBy = JObject.Parse(args["body"].ToString())["saveBy"].ToString();

            arg = arg.Replace("\r\n", "").Replace(" ", "");

            JObject json = new JObject();
            if(arg != "[]" && arg != "{}")
                json = JObject.Parse(arg);

            Dictionary<string, object> paramsDic = SettingParams(json);
            paramsDic.Add("@P_SAVEBY", saveBy);

            string sqlResult = callDb.ExecuteSql(sql, paramsDic);

            return Json(sqlResult);
        }
    }
}