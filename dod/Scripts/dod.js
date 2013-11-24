// create a model, etc. This'll be sort of the master file or something. I'm not sure how the js files will be organized.
(function () {
	namespace("leaf").model = function () {
		var self = this;

		self.stage = new Kinetic.Stage({
			container: "kContainer",
			width: 760,
			height: 560
		});

		self.tileSize = tileSize;

		self.preloader = preloader;

		// note: what is this first screen called, before the title screen?
		self.initialize = function () {
			// Preloading should ensure that various assets are available when it's time to draw them.
			preloadAssets(self.preloader);

			self.preloader.on("finish", function () {
				// Now it's ok to start playing and whatnot.
				setUpStartScreen();
			});
		};

		self.transitions = new Transitions();

		self.profile = new Profile();

		self.profileHelper = new ProfileHelper();

		// for testing:
		//var x = self.profileHelper.profileNames();
		//self.profileHelper.save("testuser", self.profile);

		self.helper = new DrawHelper();

		function preloadAssets() {
			self.preloader.addFiles("buttonSprites*:../Content/Images/buttonSprites.png");
			preloader.addFiles("startingCrawl*:../Content/Images/startingCrawl.png");
			preloader.addFiles("titleScreen*:../Content/Images/tempTitle.png");
			preloader.addFiles("tileSprites*:../Content/Images/tileSprites.png");
		}

		function setUpStartScreen() {
			var bgLayer = new Kinetic.Layer();
			self.stage.add(bgLayer);
			self.helper.drawImage(0, 0, "titleScreen", 760, 560, bgLayer);
			var buttonLayer = new Kinetic.Layer();
			self.stage.add(buttonLayer);
			var startButton = self.helper.drawImage(self.stage.getWidth() / 2 - 75, self.stage.getHeight() / 2 - 40, "buttonSprites", 150, 40, buttonLayer, 0, 0, 150, 40);
			var continueButton = self.helper.drawImage(self.stage.getWidth() / 2 - 75, self.stage.getHeight() / 2 + 40, "buttonSprites", 150, 40, buttonLayer, 0, 40, 150, 40);
			setStartButtonBehavior(startButton);
			setContinueButtonBehavior(continueButton);

			//// TODO: Comment out all of the following this, it's a "privacy screen" for testing purposes
			//var topRect = new Kinetic.Rect({
			//	width: 760,
			//	height: 560,
			//	fill: "#aaa",
			//	visible: true
			//});
			//var topLayer = new Kinetic.Layer();
			//topLayer.add(topRect);
			//self.stage.add(topLayer);
			//// Bonus: textbox on top of the canvas:
			
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
				$("#divNewProfile").show();
				
				$("#btnNewProfile").click(function () {
					if (self.profileHelper.profileNamesString().indexOf($("#txtNewProfile").val().toLowerCase()) !== -1) {
						$("#spnErrorMsg").text("This profile is already in use!").show();
						return;
					}

					// Should be safe to save a profile here since presumably it's a new one and we're not overwriting anyone's profiles.
					var msg = self.profileHelper.save($("#txtNewProfile").val(), self.profile);

					if (msg && msg.length > 0) {
						$("#spnErrorMsg").text(msg).show();
					} else {
						$("#divNewProfile").hide();
						$("#spnErrorMsg").text("").hide();
						var backRect = new Kinetic.Rect({
							width: 760,
							height: 560,
							fill: "#383870",
							visible: false
						});
						var layer = new Kinetic.Layer();
						layer.add(backRect);
						self.stage.add(layer);

						self.transitions.zowie(self.stage, function () {
							backRect.setVisible(true);
							// TODO: post-start behavior
							layer.draw();
						}, function() {
							drawStartCrawl(layer, backRect);
						});
					}
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

				if ($("#divProfilesToChoose input").length === 0) {
					for (var i = 0; i < self.profileHelper.profileNames().length; i++) {
						var profName = self.profileHelper.profileNames()[i];
						$("#divProfilesToChoose").append("<input type='button' value='" + profName + "'/>");
					}
				}


				// Use this code upon a press of a profile button!
				//self.transitions.tilesweep(self.stage, function () {
					
				//}, function () {
				//	// End-transition code here
				//});
			});
		}

		function drawStartCrawl(layer, backRect) {
			var crawlImage = self.helper.drawImage(0, 560, "startingCrawl", 760, 900, layer);
			var continueButton = self.helper.drawImage(620, 760, "buttonSprites", 150, 40, layer, 0, 40, 150, 40);

			continueButton.on("mouseup", function () {
				self.transitions.zowie(self.stage, function () {
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

	// *** globals ***
	var preloader = html5preloader();
	var tileSize = 40;

	// *** various functions outside of the main model ***
	function Transitions() {
		var self = this;

		self.helper = new DrawHelper();

		self.zowie = function (stage, callback, callback2) {
			var strokeWidth = 20;
			var currentStroke = 0;
			var canvasWidthCenter = stage.getWidth() / 2;
			var canvasHeightCenter = stage.getHeight() / 2;
			var counter = 0;
			var goUp = true;
			var rectArray = [];
			var layer = new Kinetic.Layer();
			stage.add(layer);

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
						callback(); // This is where you can do whatever you need to under the fully-expanded transition animation.
					}
				} else {
					if (rectArray[counter - 1]) {
						rectArray[counter - 1].destroy();
						layer.draw();
					}

					counter--;

					if (counter === 0) {
						clearInterval(interval);
						callback2(); // This is where you do whatever at the end of the transition
					}
				}
			}, 75);
		};

		self.tilesweep = function (stage, callback, callback2) {
			var tsize = tileSize;
			var layer = new Kinetic.Layer();
			stage.add(layer);
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
									self.helper.drawImageTimed(i * tsize, j * tsize, "tileSprites", tsize, tsize, layer, 0, 0, tsize, tsize, 2000);
								} else {
									self.helper.drawImageTimed(i * tsize, j * tsize, "tileSprites", tsize, tsize, layer, tsize * 1, 0, tsize, tsize, 2000);
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
						callback2();
					}
				}
			}, 60);
		};

		return self;
	}

	function Gameboard() {
		var self = this;

		// draw a board: A bunch of tiles. what kind of data structure would I use to serialize a gameboard?

		return self;
	}

	// This is where various objects are set up
	function Profile() {
		var self = this;

		self.Name = "";
		// some example items that may or may not get used
		// I can't really go forward with this until I know what info needs to be stored. When known, move above this comment line.
		self.Money = 0;
		self.Strength = 0;
		self.Intelligence = 0;
		self.Pet = "";

		return self;
	}

	function ProfileHelper() {
		var self = this;
		self.profileNamesKey = "leaf.profiles";

		self.profileNamesString = function () {
			if (localStorage[self.profileNamesKey]) {
				return localStorage[self.profileNamesKey];
			} else {
				return "";
			}
		};

		self.profileNames = function () {
			if (localStorage[self.profileNamesKey]) {
				return localStorage[self.profileNamesKey].split(",");
			} else {
				return "";
			}
		};

		/// <summary>
		/// This method saves the actual profile, a stringified object
		/// </summary>
		self.save = function (profileName, profile) {
			if (profileName != null && profileName.length > 0) {
				// I need to check against the list!
				profileName = profileName.toLowerCase();

				var profileList = localStorage[self.profileNamesKey];

				if (typeof profileList == "undefined") {
					profileList = "";
				}

				if (profileList.length === 0) {
					profileList = profileName;
				} else {
					var profileArray = profileList.split(",");
					
					if (profileArray.length > 5) {
						return "profile list is full: " + profileList;
					}
					
					if (profileList.indexOf(profileName) === -1) {
						profileList += "," + profileName;
					}
				}

				localStorage[self.profileNamesKey] = profileList;
				localStorage[self.profileNamesKey + "." + profileName] = JSON.stringify(profile);
			} else {
				return "profileName is empty: ProfileHelper.save()";
			}

			return "";
		};

		return self;
	}

	function DrawHelper() {
		var self = this;
		self.preloader = preloader;

		/// <summary>
		/// Draws an image to the specified layer, in the specified location.
		/// Optionally, cropping coordinates may be added.
		/// </summary>
		self.drawImage = function (x, y, image, width, height, layer, cropX, cropY, cropWidth, cropHeight) {
			// This won't work. I think I'm going to have to pass in the actual image instead of a string. No problem, should work fine. Or, use a global preloader
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
		};

		/// <summary>
		/// Same as drawImage() but the timeout will destroy the item! Possibly move this to some kind of utility class function.
		/// </summary>
		self.drawImageTimed = function (x, y, image, width, height, layer, cropX, cropY, cropWidth, cropHeight, timeout) {
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

			layer.add(imageObj);
			setTimeout(function () {
				imageObj.destroy();
			}, timeout);
			return imageObj;
		};

		return self;
	}

	$("document").ready(function () {
		var model = namespace("leaf").model();
		model.initialize();
	});
})();
