using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using demoapp.SettingConfig;
using System.Data;

namespace demoapp.Model
{
    public class CallDb
    {
        

        public CallDb()
        {
        }


        // Read 기능 
        // sql : sql 명
        // params : param 값
        public string LoadSql(string SQL, Dictionary<string, object> Params)
        {
            try
            {
                object param = new object();
                param = Params.AsList();
                string returnData;

                using (var connection = new SqlConnection(DbConfig.ConnectionString))
                {
                    List<dynamic> sqlResult = connection.Query(SQL, param, commandType: System.Data.CommandType.StoredProcedure).AsList();
                    returnData = JsonConvert.SerializeObject(sqlResult);
                }

                return returnData;
            }
            catch(Exception ex)
            {
                string err_msg = ex.Message;

                // 권한에 따른 Error 구분 처리 필요함.

                return err_msg;
            }
        }

        public JObject LoadSqlSingle(string SQL, Dictionary<string, object> Params)
        {

            JObject obj1 = new JObject();

            try
            {
                object param = new object();
                param = Params.AsList();
                List<dynamic> sqlResult = new List<dynamic>();
                // List<object> sr = new List<object>();
                List<dynamic> headResult = new List<dynamic>();

                using (var connection = new SqlConnection(DbConfig.ConnectionString))
                {
                    using(var output = connection.QueryMultipleAsync(SQL,
                            param,
                            commandType: System.Data.CommandType.StoredProcedure))
                    {
                        // var ot = output;
                        headResult = output.Result.ReadAsync<dynamic>().Result.ToList<dynamic>();
                        
                        try
                        {
                            sqlResult = output.Result.ReadAsync<dynamic>().Result.ToList<dynamic>();
                        }
                        catch
                        {  
                            sqlResult = headResult;
                        }

                    }

                }

                if (headResult == sqlResult)
                    obj1 = MakeHeader.returnData(sqlResult);
                else
                { 
                    List<string> headerSet = new List<string>();

                    foreach(var item in headResult[0])
                    {                        
                        headerSet.Add(item.Value);
                    }


                    obj1["header"] = JToken.FromObject(headerSet);
                    obj1["data"] = JToken.FromObject(sqlResult);
                }

                return obj1;
            }
            catch (Exception ex)
            {
                string msg = ex.Message.Replace("One or more errors occurred. (", "").Replace(".)", ".");
                obj1["err"] = JToken.FromObject(msg);
                return obj1;
            }
        }



        public string ExecuteSql(string SQL, Dictionary<string, object> Params)
        {
            try
            {
                object param = new object();
                param = Params.AsList();
                
                using (var connection = new SqlConnection(DbConfig.ConnectionString))
                {
                    var sqlResult = connection.Execute(SQL, param, commandType: System.Data.CommandType.StoredProcedure);
                }

                return "Ok";
            }
            catch(Exception ex)
            {
                string err_msg = ex.Message;

                // 권한에 따른 Error 구분 처리 필요함.

                return err_msg;
            }
        }

        
    }
}