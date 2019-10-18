using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using demoapp.SettingConfig;

namespace demoapp.Model
{
    public class ModelBase : IModel
    {
        public object Copy()
        {
            return this.MemberwiseClone();
        }
    }

     public class ModelArgsBase : IModelArgs
    { }

    public class RepositoryBase : IRepository
    {
      public RepositoryBase()
        {
            this.Ctx = new SqlConnection(DbConfig.ConnectionString);
        }

        public RepositoryBase(IDbConnection ctx)
        {
            this.Ctx = ctx;
        }

        public IDbConnection Ctx { get; set; }
    }

     public abstract class RepositoryUserBase<ModelT, ArgsT> : RepositoryBase
    {
        public RepositoryUserBase() : base()
        {}

        public RepositoryUserBase(IDbConnection ctx, ArgsT args) : this()
        {
            this.Ctx = ctx;
            Args = args;            
        }

        public ArgsT Args { get; set; }
        public ModelT SelectModel { get; set; }

    }

    public abstract class RepositorySingleBase<ModelT, ArgsT> : RepositoryBase
    {
        public RepositorySingleBase() : base()
        {}

        public RepositorySingleBase(IDbConnection ctx, ArgsT args) : this()
        {
            this.Ctx = ctx;
            Args = args;            
        }

        public ArgsT Args { get; set; }
        public List<ModelT> SelectedModels { get; set; }
        public ModelT SelectModel { get; set; }

    }

    public abstract class RepositoryListBase<ModelT, ArgsT> : RepositoryBase
    {
        public RepositoryListBase() : base()
        { }

        public RepositoryListBase(IDbConnection ctx, ArgsT args) : this()
        {
            this.Ctx = ctx;
            Args = args;
        }

        public abstract List<ModelT> SelectModels(ArgsT args);

        public ArgsT Args { get; set; }
        public List<ModelT> SelectedModels { get; set; }
        public ModelT SelectModel {get; set;}

    }
}