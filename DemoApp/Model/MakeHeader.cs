using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace demoapp.Model
{
    public class MakeHeader
    {
        
        private static void GetHeader(List<dynamic> sqlResult, ref List<string> header)
        {
            foreach (var item in sqlResult)
            {
                header = ((IDictionary<string, object>)item).Keys.ToList<string>();

                if (header.Count() != 0)
                    break;
            }
        }
        
        public static JObject returnData(CodeRepo _codeRepo, ref List<string> header)
        {
            

            JObject obj1 = new JObject();

            header.Add("CODE");
            header.Add("NAME");

            obj1["header"] = JToken.FromObject(header);
            obj1["data"] = JToken.FromObject(_codeRepo.SelectedModels);

            JObject sqlResult = obj1;
            return sqlResult;
        }

        public static JObject returnData(List<dynamic> sqlResult)
        {            
            List<string> header = new List<string>();
            
            GetHeader(sqlResult, ref header);

            JObject obj1 = new JObject();

            obj1["header"] = JToken.FromObject(header);
            obj1["data"] = JToken.FromObject(sqlResult);
            return obj1;
        }
    }
}