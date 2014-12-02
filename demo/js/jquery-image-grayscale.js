(function ($) {
	var isAboveIE10 = function () {
		var isStyles = [
			['msTouchAction', 'msWrapFlow'], ['msTextCombineHorizontal']
		],
		d = document,
		b = d.body,
		s = b.style,
		result = false,
		property;
		for (var i = 0; i < isStyles.length; i++) {
			for (var j = 0; j < isStyles[i].length; j++) {
				property = isStyles[i][j];
				if (typeof(s[property]) != 'undefined') {
					result = true;
				} else {
					result = false;
				}
			}
			if (result) {
				return result;
			}
		}

	};

	var grayscaleIe = function (src) {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var imgObj = new Image();
		imgObj.src = src;
		canvas.width = imgObj.width;
		canvas.height = imgObj.height;
		ctx.drawImage(imgObj, 0, 0);
		var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (var y = 0; y < imgPixels.height; y++) {
			for (var x = 0; x < imgPixels.width; x++) {
				var i = (y * 4) * imgPixels.width + x * 4;
				var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
				imgPixels.data[i] = avg;
				imgPixels.data[i + 1] = avg;
				imgPixels.data[i + 2] = avg;
			}
		}
		ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
		return canvas.toDataURL();
	};

	$.fn.grayscaleImage = function () {
		if (isAboveIE10()) {
			this.find('img').each(function () {
				var _this = $(this),
				targetImgWidth = _this.width(),
				targetImgHeight = _this.height();
				_this.css({
					"position" : "absolute"
				}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale ieImage').css({
					"position" : "absolute",
					"z-index" : "5",
					"opacity" : "1"
				}).insertBefore(_this).queue(function () {
					var el = $(this);
					el.parent().css({
						"width" : targetImgWidth,
						"height" : targetImgHeight
					});
					el.dequeue();
				});

				this.src = grayscaleIe(this.src);
			});

			this.on({
				'mouseenter' : function () {
					var originalImg = $(this).find('.img_grayscale');
					originalImg.css('opacity', 0);
				},
				'mouseleave' : function () {
					var originalImg = $(this).find('.img_grayscale');
					originalImg.css('opacity', 1);
				}
			});

		}
		return this;
	}
}(jQuery));