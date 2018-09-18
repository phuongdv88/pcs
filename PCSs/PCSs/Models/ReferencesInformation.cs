using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PCSs.Models
{
    public class ReferencesInformation
    {
        public ReferenceInfo Reference1 { get; set; }
        public ReferenceInfo Reference2 { get; set; }
        public ReferencesInformation(long? companyId)
        {
            //Reference1 = new ReferenceInfo();
            //Reference2 = new ReferenceInfo();
            using (var db = new PCSEntities())
            {
                List<ReferenceInfo> refers = db.ReferenceInfoes.Where(s => s.CompanyInfoId == companyId).ToList();
                try
                {
                    Reference1 = refers[0];
                    Reference2 = refers[1];
                }
                catch
                {
                }
            }
        }
    }
}