using System.Data;

namespace demoapp.Model
{
    public class IModel
    {
        
    }

    public interface IModelArgs
    {

    }

    public interface IRepository
    {
        IDbConnection Ctx { get; set; }
    }
}