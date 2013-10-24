using System.Web.Optimization;

namespace dod.App_Start
{
	public class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/js/main").Include(
				"~/Scripts/modernizr.custom.js",
                "~/Scripts/raphael.js",
                "~/Scripts/common.js",
                "~/Scripts/dod.js",
                "~/Scripts/html5preloader.js"
			));

			bundles.Add(new StyleBundle("~/Content/css").Include(
				// css here
				"~/Content/jqueryui/jquery-ui-custom.css",
				"~/Content/style.css"
			));
		}
	}
}