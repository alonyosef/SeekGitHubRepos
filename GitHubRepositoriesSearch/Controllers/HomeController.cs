using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Newtonsoft.Json;

namespace GitHubRepositoriesSearch.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //return existing bookmark ids on home page for a new search
            return View(getBookmarksIds());
        }
        
        //Add a bookmark to / Remove a bookmark from session
        //repository is the original json object as string, form a Github search
        public ActionResult SetBookmark(string repository)
        {            
            try
            {
                //create the actual object
                dynamic item = JsonConvert.DeserializeObject(repository); 
                //Handle the list on session
                var bookmarks = (List<object>)Session["Bookmarks"];
                if (bookmarks == null)
                {
                    bookmarks = new List<object>();
                    bookmarks.Add(item);
                }
                else
                {
                    //add/remove bookmark
                    var existingItem = getBookmark((int)item.id);
                    if (existingItem == null)
                        bookmarks.Add(item);
                    else
                        bookmarks.Remove(existingItem);
                }                
                
                Session["Bookmarks"] = bookmarks;
                return Json(new { status = "ok", result = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {                 
                return Json(new { status = "error", result = ex }, JsonRequestBehavior.AllowGet);
            }            
        }    
        
        //replacement to contains since object is dynamic
        private object getBookmark(int id)
        {
            var bookmarks = (List<object>)Session["Bookmarks"];
            foreach (dynamic bookmark in bookmarks)
                if (bookmark.id == id)
                    return bookmark;
            return null;
        }

        public ActionResult About()
        {            
            return View();
        }

        public ActionResult Bookmarks()
        {            
            //returns all bookmarks
            return View(Session["Bookmarks"]);            
        }

        //gets the ids of the existing bookmarks
        private int[] getBookmarksIds()
        {
            dynamic bookmarks = (List<object>)Session["Bookmarks"];
            if (bookmarks == null)
                return null;
            var ids = new int[bookmarks.Count];
            for (int i = 0; i < ids.Length; i++)
                ids[i] = bookmarks[i].id;
            return ids;
        }
      
    }
}