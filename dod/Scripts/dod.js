// create a model, etc. This'll be sort of the master file or something. I'm not sure how the js files will be organized.
(function () {
	namespace("leaf").model = function () {
		var self = this;

		self.stage = new Kinetic.Stage({
			container: "kContainer",
			width: 760,
			height: 560
		});

		self.preloader = html5preloader();
		// note: what is this first screen called, before the title screen?
		self.initialize = function () {
			// Preloading should ensure that various assets are available when it's time to draw them.
			preloadAssets(self.preloader);

			self.preloader.on("finish", function () {
				// Now it's ok to start playing and whatnot.
				var bgLayer = new Kinetic.Layer();
				drawImageToStage(0, 0, "titleScreen", 760, 560, bgLayer);
				var buttonLayer = new Kinetic.Layer();
				var startButton = drawImageToStage(self.stage.getWidth() / 2 - 75, self.stage.getHeight() / 2 - 40, "buttonSprites", 150, 40, buttonLayer, 0, 0, 150, 40);
				var continueButton = drawImageToStage(self.stage.getWidth() / 2 - 75, self.stage.getHeight() / 2 + 40, "buttonSprites", 150, 40, buttonLayer, 0, 40, 150, 40);
				setStartButtonBehavior(startButton);
				setContinueButtonBehavior(continueButton);
			});
		};

		function preloadAssets(preloader) {
			preloader.addFiles("buttonSprites*:../Content/Images/buttonSprites.png");
			preloader.addFiles("startingCrawl*:../Content/Images/startingCrawl.png");
			preloader.addFiles("titleScreen*:../Content/Images/tempTitle.png");
			preloader.addFiles("tileSprites*:../Content/Images/tileSprites.png");
		}

		function setStartButtonBehavior(button) {
			button.on("mousedown", function () {
				button.setCrop({
					x: 2,
					y: 2,
					width: 146,
					height: 36
				});
				button.draw();
			});
			button.on("mouseup", function () {
				button.setCrop({
					x: 0,
					y: 0,
					width: 150,
					height: 40
				});
				button.draw();
				drawTransitionOne();
				// TODO: display intro and go from there
			});
		}

		function setContinueButtonBehavior(button) {
			button.on("mousedown", function () {
				button.setCrop({
					x: 2,
					y: 42,
					width: 146,
					height: 36
				});
				button.draw();
			});
			button.on("mouseup", function () {
				button.setCrop({
					x: 0,
					y: 40,
					width: 150,
					height: 40
				});
				button.draw();
				drawTransitionOne();
				// TODO: Select from saved games
			});
		}

		/// <summary>
		/// Draws an image to the specified stage, in the specified location.
		/// Optionally, cropping coordinates may be added.
		/// </summary>
		function drawImageToStage(x, y, image, width, height, layer, cropX, cropY, cropWidth, cropHeight) {
			var img = self.preloader.getFile(image);
			var imageObj = new Kinetic.Image({
				x: x,
				y: y,
				image: img,
				width: width,
				height: height
			});

			if (cropX !== undefined && cropY !== undefined && cropWidth !== undefined && cropHeight !== undefined) {
				imageObj.setCrop({
					x: cropX,
					y: cropY,
					width: cropWidth,
					height: cropHeight
				});
			}

			// Consider some way to manage layers centrally, otherwise you're going to have layers running willy-nilly.
			layer.add(imageObj);
			self.stage.add(layer);
			return imageObj;
		}

		function drawTransitionOne() {
			var strokeWidth = 20;
			var currentStroke = 0;
			var canvasWidthCenter = self.stage.getWidth()/2;
			var canvasHeightCenter = self.stage.getHeight()/2;
			var counter = 0;
			var goUp = true;
			var rectArray = [];
			
			// #383870
			var backRect = new Kinetic.Rect({
				width: 760,
				height: 560,
				fill: "#383870",
				visible: false
			});

			var layer = new Kinetic.Layer();
			layer.add(backRect);
			// backRect.setZIndex(18);
			self.stage.add(layer);

			var interval = setInterval(function () {
				if (goUp === true) {
					var color = counter % 2 === 1 ? 'black' : 'green';
					var rectangle = new Kinetic.Rect({
						x: canvasWidthCenter - currentStroke - 60,
						y: canvasHeightCenter - currentStroke,
						width: currentStroke * 2 + 120,
						height: currentStroke * 2,
						stroke: color,
						strokeWidth: strokeWidth
					});

					rectArray[counter] = rectangle;
					layer.add(rectangle);
					rectangle.setZIndex(20 + counter);
					//self.stage.add(layer);
					layer.draw();

					currentStroke += strokeWidth;
					counter++;
					
					if (counter > 18) {
						goUp = false;
						backRect.setVisible(true);
						//backLayer.draw();
					}
				} else {
					// remove the upper-most rect in rectArray
					if (rectArray[counter - 1]) {
						rectArray[counter - 1].destroy();
						layer.draw();
					}

					counter--;

					if (counter === 0) {
						clearInterval(interval);
					}
				}
			}, 50);
		}

		function drawStartCrawl() {
			
		}

		return self;
	};

	$("document").ready(function () {
		var model = namespace("leaf").model();
		model.initialize();
	});
})();
