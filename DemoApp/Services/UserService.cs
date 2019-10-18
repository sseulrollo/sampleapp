using demoapp.Model;

namespace demoapp.Services
{
    public class UserService: IUserService
    {
        public UserModel Authenticate(UserModelArgs _args)
        {
            UserRepo _userRepo = new UserRepo();    
            _userRepo.SelectModels(_args);
            
            return _userRepo.SelectModel;
        }

        public UserModel Authenticate(string Id, string password)
        {
            UserRepo _userRepo = new UserRepo();   
            UserModelArgs _args = new UserModelArgs();
            _args.USER_ID = Id;
            _args.PASSWORD = password;
            _args.LANG = "KOR"; //JObject.Parse(args["body"].ToString())["lang_id"].ToString();
            _args.IP = "";
              
            _userRepo.SelectModels(_args);
            
            return _userRepo.SelectModel;
        }
    }

    public interface IUserService
    {
        UserModel Authenticate(UserModelArgs _args);     

        UserModel Authenticate(string Id, string password);      
    }
}