// create a model, etc. This'll be sort of the master file or something. I'm not sure how the js files will be organized.
(function () {
	namespace("leaf").model = function () {
		var self = this;

		self.canvas = document.getElementById('myCanvas');

		self.preloader = html5preloader();
		// note: what is this first screen called, before the title screen?
		self.initialize = function () {
			// Preloading should ensure that various assets are available when it's time to draw them.
			preloadAssets(self.preloader);

			self.preloader.on("finish", function () {
				// Now it's ok to start playing and whatnot.
				drawTitleScreen();
			});

		};

		function preloadAssets(preloader) {
			preloader.addFiles("titleScreen*:../Content/Images/tempTitle.png");
			preloader.addFiles("tileSprites*:../Content/Images/tileSprites.png");
			preloader.addFiles("buttonSprites*:../Content/Images/buttonSprites.png");

		}

		function drawTitleScreen() {
			if (self.canvas && self.canvas.getContext) {
				var ctx = self.canvas.getContext('2d');
				if (ctx) {
					var img = self.preloader.getFile("titleScreen");
					ctx.drawImage(img, 0.5, 0.5);
					prepareTitleButtons(ctx);
				}
			}
		}

		function prepareTitleButtons(ctx) {
			var buttonWidth = 150;
			var buttonHeight = 40;
			var img = self.preloader.getFile("buttonSprites");
			ctx.save();
			ctx.translate((self.canvas.width - buttonWidth) / 2, (self.canvas.height - buttonHeight - 60) / 2);
			ctx.drawImage(img, 0, 0, buttonWidth - 1, buttonHeight - 1, 0, 0, buttonWidth - 1, buttonHeight - 1);
			ctx.restore();
			ctx.save();
			ctx.translate((self.canvas.width - buttonWidth) / 2, (self.canvas.height - buttonHeight + 60) / 2);
			ctx.drawImage(img, 0, buttonHeight - 1, buttonWidth - 1, buttonHeight - 1, 0, 0, buttonWidth - 1, buttonHeight - 1);
			ctx.restore();
		}

		return self;
	};

	$("document").ready(function () {
		var model = namespace("leaf").model();
		model.initialize();
	});
})();