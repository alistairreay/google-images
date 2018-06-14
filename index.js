'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var qs = require('querystring');
var got = require('got');

var Client = function () {
	function Client(id, apiKey) {
		_classCallCheck(this, Client);

		if (!id) {
			throw new TypeError('Expected a Custom Search Engine ID');
		}

		if (!apiKey) {
			throw new TypeError('Expected an API key');
		}

		this.endpoint = 'https://www.googleapis.com';
		this.apiKey = apiKey;
		this.id = id;
	}

	_createClass(Client, [{
		key: 'search',
		value: function search(query, options) {
			if (!query) {
				throw new TypeError('Expected a query');
			}

			var url = this.endpoint + '/customsearch/v1?' + this.buildQuery(query, options);

			return got(url, { json: true }).then(function (res) {
				var items = res.body.items || [];

				return items.map(function (item) {
					return {
						type: item.mime,
						width: item.image.width,
						height: item.image.height,
						size: item.image.byteSize,
						url: item.link,
						thumbnail: {
							url: item.image.thumbnailLink,
							width: item.image.thumbnailWidth,
							height: item.image.thumbnailHeight
						},
						description: item.snippet,
						parentPage: item.image.contextLink
					};
				});
			});
		}
	}, {
		key: 'buildQuery',
		value: function buildQuery(query, options) {
			options = options || {};

			var result = {
				q: query.replace(/\s/g, '+'),
				searchType: 'image',
				cx: this.id,
				key: this.apiKey
			};

			if (options.page) {
				result.start = options.page;
			}

			if (options.size) {
				result.imgSize = options.size;
			}

			if (options.type) {
				result.imgType = options.type;
			}

			if (options.dominantColor) {
				result.imgDominantColor = options.dominantColor;
			}

			if (options.colorType) {
				result.imgColorType = options.colorType;
			}

			if (options.safe) {
				result.safe = options.safe;
			}

			return qs.stringify(result);
		}
	}]);

	return Client;
}();

module.exports = Client;
