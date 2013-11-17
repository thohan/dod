// create a model, etc. This'll be sort of the master file or something. I'm not sure how the js files will be organized.
(function () {
	namespace("leaf").model = function () {
		var self = this;

		self.stage = new Kinetic.Stage({
			container: "kContainer",
			width: 760,
			height: 560
		});

		self.tileSize = 40;

		self.preloader = html5preloader();

		// note: what is this first screen called, before the title screen?
		self.initialize = function () {
			// Preloading should ensure that various assets are available when it's time to draw them.
			preloadAssets(self.preloader);

			self.preloader.on("finish", function () {
				// Now it's ok to start playing and whatnot.
				var bgLayer = new Kinetic.Layer();
				self.stage.add(bgLayer);
				drawImageToStage(0, 0, "titleScreen", 760, 560, bgLayer);
				var buttonLayer = new Kinetic.Layer();
				self.stage.add(buttonLayer);
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
				var backRect = new Kinetic.Rect({
					width: 760,
					height: 560,
					fill: "#383870",
					visible: false
				});
				var layer = new Kinetic.Layer();
				layer.add(backRect);
				self.stage.add(layer);

				drawTransitionOne(function () {
					backRect.setVisible(true);
					layer.draw();
				}, function () {
					drawStartCrawl(layer, backRect);
				});
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
				drawTransitionTwo(function () {
					// Mid-transition code here
				});
				// TODO: Select from saved games
			});
		}

		/// <summary>
		/// Draws an image to the specified layer, in the specified location.
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
			layer.draw();
			return imageObj;
		}

		/// <summary>
		/// Same as drawImageToStage() but the timeout will destroy the item!
		/// </summary>
		function drawImageToStageTimed(x, y, image, width, height, layer, cropX, cropY, cropWidth, cropHeight, timeout) {
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
			setTimeout(function () {
				imageObj.destroy();
			}, timeout);
			return imageObj;
		}

		function drawTransitionOne(callback, callback2) {
			var strokeWidth = 20;
			var currentStroke = 0;
			var canvasWidthCenter = self.stage.getWidth() / 2;
			var canvasHeightCenter = self.stage.getHeight() / 2;
			var counter = 0;
			var goUp = true;
			var rectArray = [];
			var layer = new Kinetic.Layer();
			self.stage.add(layer);

			var interval = setInterval(function () {
				if (goUp === true) {
					var color = counter % 2 === 1 ? 'black' : 'green';
					var rectangle = new Kinetic.Rect({
						x: canvasWidthCenter - (currentStroke + 60 + strokeWidth / 4),
						y: canvasHeightCenter - (currentStroke + strokeWidth / 4),
						width: currentStroke * 2 + 120 + strokeWidth / 4,
						height: currentStroke * 2 + strokeWidth / 4,
						stroke: color,
						strokeWidth: strokeWidth
					});

					rectArray[counter] = rectangle;
					layer.add(rectangle);
					layer.draw();

					currentStroke += strokeWidth;
					counter++;

					if (counter > 20) {
						goUp = false;
						callback();	// This is where you can do whatever you need to under the fully-expanded transition animation.
					}
				} else {
					if (rectArray[counter - 1]) {
						rectArray[counter - 1].destroy();
						layer.draw();
					}

					counter--;

					if (counter === 0) {
						clearInterval(interval);
						callback2();	// This is where you do whatever at the end of the transition
					}
				}
			}, 75);
		}

		function drawTransitionTwo(callback, callback2) {
			var tsize = self.tileSize;
			var layer = new Kinetic.Layer();
			self.stage.add(layer);
			var counter = 0;
			var goUp = true;
			var i;
			var j;
			var totalShapes = 0;
			
			var interval = setInterval(function () {
				if (goUp === true) {
					j = 0;
					i = counter;
					
					while (i >= 0) {
						if (i >= 0 && i < 19 && j >= 0 && j < 14) {
							if (i >= 0) {
								if ((i % 2 === 1 && j % 2 === 1) || (i % 2 === 0 && j % 2 === 0)) {
									drawImageToStageTimed(i * tsize, j * tsize, "tileSprites", tsize, tsize, layer, 0, 0, tsize, tsize, 2000);
								} else {
									drawImageToStageTimed(i * tsize, j * tsize, "tileSprites", tsize, tsize, layer, tsize * 1, 0, tsize, tsize, 2000);
								}
								
								totalShapes++;
							}
						}
						
						j++;
						i--;
					}

					layer.draw();
					counter++;

					if (counter > 32) {
						goUp = false;
						callback();
					}
				} else {
					layer.draw();
					counter--;

					if (counter <= 0) {
						clearInterval(interval);
					}
				}
			}, 60);
		}

		function drawStartCrawl(layer, backRect) {
			var crawlImage = drawImageToStage(0, 560, "startingCrawl", 760, 900, layer);
			var continueButton = drawImageToStage(620, 760, "buttonSprites", 150, 40, layer, 0, 40, 150, 40);
			continueButton.on("mouseup", function () {
				drawTransitionOne(function () {
					backRect.destroy();
					continueButton.destroy();
					crawlImage.destroy();
					// TODO: Add the game board!
					layer.draw();
				}, function () {
					// what?
				});
			});
			var interval = setInterval(function () {
				crawlImage.setY(crawlImage.getY() - 1);

				layer.draw();

				if (continueButton.getY() > 480) {
					continueButton.setY(continueButton.getY() - 1);
				}

				if (crawlImage.getY() < -560) {
					clearInterval(interval);
				}
			}, 20);

			// TODO: Add skip/continue buttons and their behaviors
		}

		return self;
	};

	$("document").ready(function () {
		var model = namespace("leaf").model();
		model.initialize();
	});
})();
