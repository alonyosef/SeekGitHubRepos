using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GitHubRepositoriesSearch.Startup))]
namespace GitHubRepositoriesSearch
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
