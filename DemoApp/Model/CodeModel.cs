using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using Dapper;

namespace demoapp.Model
{
    public class CodeModel : ModelBase
    {
        [Display(Name="코드")]
        public string CODE { get; set; }

        [Display(Name="코드명")]
        public string NAME { get; set; }

        [Display(Name="정렬")]
        public string SORT { get; set; }

        [Display(Name="오류메세지")]
        public string Err { get; set; }
    }

    public class CodeModelArgs : IModelArgs
    {
        public string Gropu_Id { get; set; }
        public string Where { get; set; }
    }

    public class CodeRepo : RepositorySingleBase<CodeModel, CodeModelArgs>
    {
        public CodeModel SelectModels(CodeModelArgs args) 
        {
            string GetCodeSp = "pk_atm_sp_code";
            try{
                SelectedModels = Ctx.Query<dynamic>(GetCodeSp, 
                        new { P_GROUP_ID = args.Gropu_Id, P_WHERE = args.Where == "" ? null : args.Where }, 
                        commandType: CommandType.StoredProcedure)
                    .Select(r =>
                        new CodeModel{
                            CODE = r.CODE == null ?  r.코드 : r.CODE,
                            NAME = r.NAME == null ? r.이름 : r.NAME
                        }                    
                    ).ToList<CodeModel>();
            }
            catch(Exception ex) {
                SelectedModels.Add(new CodeModel{Err=ex.Message});                
            }
            return SelectModel;
        }
    }
}