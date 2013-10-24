// create a model, etc. This'll be sort of the master file or something. I'm not sure how the js files will be organized.
(function () {
    namespace("leaf").model = function () {
        var self = this;

        self.preloader = html5preloader();
        // note: what is this first screen called, before the title screen?
        self.initialize = function () {
            preloader.addFiles("myFile*:../Content/Images/tempTitle.png");
            preloader.on("finish", function () {
                var image = preloader.getFile("myFile");
                var $canvas = $('#myCanvas');
                $canvas.after(image);   // THis is nifty, but how can I know for sure that the image was actually preloaded? I guess I'll just have to trust it.
            });
        };

        return self;
    };

    $("document").ready(function () {
        var model = namespace("leaf.model");
        model().initialize();
    });
})();