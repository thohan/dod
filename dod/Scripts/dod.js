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
		}

		function drawTitleScreen() {
			if (self.canvas && self.canvas.getContext) {
				var ctx = self.canvas.getContext('2d');
				if (ctx) {
					var img = self.preloader.getFile("titleScreen");
					//img.src = self.preloader.getFile("titleScreen");
					ctx.drawImage(img, 0.5, 0.5);

					drawTitleButtons(ctx);
				}
			}
		}

		function drawTitleButtons(ctx) {
			var offsetWidth = 50;
			var offsetHeight = 15;
			ctx.save();
			ctx.translate(self.canvas.width / 2 - offsetWidth, self.canvas.height / 2 - offsetHeight);
			ctx.moveTo(0, 0);
			ctx.lineTo(100, 0);
			ctx.lineTo(100, 30);
			ctx.lineTo(0, 30);
			ctx.lineTo(0, 0);
			ctx.stroke();
			ctx.restore();
		}

		return self;
	};

	$("document").ready(function () {
		var model = namespace("leaf").model();
		model.initialize();
	});
})();