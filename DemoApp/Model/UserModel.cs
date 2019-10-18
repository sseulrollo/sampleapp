using System;
using System.Data;
using System.Linq;
using Dapper;

namespace demoapp.Model
{
    public class UserModel : ModelBase
    {
        public string ID { get; set; }  
        public string NAME { get; set; }
        public string AUTH { get; set; }
        public string DEPT_NAME { get; set; }

        public string IDD { get; set; }

        public string ERR { get; set; }

        public string TOKEN {get; set;}
    }

    public class UserModelArgs : IModelArgs
    {
        public string USER_ID { get; set; }
        public string PASSWORD { get; set; }
        public string LANG { get; set; }

        public string IP { get; set; }
    }


    public class UserRepo : RepositoryUserBase<UserModel, UserModelArgs>
    {
        public UserModel SelectModels(UserModelArgs args) 
        {
            string GetCodeSp = "pk_ATM_sp_login_L";
            try{
                SelectModel = Ctx.Query<UserModel>(GetCodeSp, 
                new { 
                    P_ID = args.USER_ID, 
                    P_IP = args.IP, 
                    P_LANG_ID = args.LANG,
                    P_PASSWORD = args.PASSWORD }, 
                commandType: CommandType.StoredProcedure).SingleOrDefault();
            }
            catch(Exception ex) {
                SelectModel = new UserModel();
                SelectModel.ID =args.USER_ID;
                SelectModel.ERR = ex.Message;
             }
            return SelectModel;
        }
    }
}