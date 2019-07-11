using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace GitHubRepositoriesSearch
{
    /// <summary>
    /// Summary description for WebService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WebService : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public void AddToFavorites(object repository)
        {
            List<object> favorites = (List<object>) Session["Favorites"];
            if (favorites == null)
                favorites = new List<object>();
            else if (favorites.Contains(repository))
            {
                favorites.Remove(repository);
                return;
            }
            favorites.Add(repository);
        }
    }
}
