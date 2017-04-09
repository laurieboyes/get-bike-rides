/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getBikeRides = __webpack_require__(3);

var _getBikeRides2 = _interopRequireDefault(_getBikeRides);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _getBikeRides2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  activitySegments: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments',
  locationSamples: 'derived:com.google.location.sample:com.google.android.gms:merge_location_samples'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.queryFitnessDataSource = queryFitnessDataSource;

var _getNanos = __webpack_require__(4);

var _getNanos2 = _interopRequireDefault(_getNanos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryFitnessDataSource(dataSourceId, fromDate, toDate) {
	var path = 'fitness/v1/users/me/dataSources/' + dataSourceId + '/datasets/' + (0, _getNanos2.default)(fromDate) + '-' + (0, _getNanos2.default)(toDate);
	return gapi.client.request({ path: path }).then(function (_ref) {
		var point = _ref.result.point;
		return point;
	});
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _numberArrayFuzzyFindIndex = __webpack_require__(5);

var _numberArrayFuzzyFindIndex2 = _interopRequireDefault(_numberArrayFuzzyFindIndex);

var _dataSources = __webpack_require__(1);

var _dataSources2 = _interopRequireDefault(_dataSources);

var _queries = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getClosestLatLng(locationPoints, nanos) {
	var sortedPoints = locationPoints.sort();
	var closestLocation = sortedPoints[(0, _numberArrayFuzzyFindIndex2.default)(sortedPoints.map(function (l) {
		return l.startTimeNanos;
	}), nanos)];
	return {
		lat: +closestLocation.value[0].fpVal,
		lng: +closestLocation.value[1].fpVal
	};
}

exports.default = function (fromDate, toDate) {
	return Promise.all([_dataSources2.default.activitySegments, _dataSources2.default.locationSamples].map(function (d) {
		return (0, _queries.queryFitnessDataSource)(d, fromDate, toDate);
	})).then(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    activities = _ref2[0],
		    locationPoints = _ref2[1];

		if (!activities) {
			throw new Error('No activities found in the given range');
		}

		return activities

		//point is an array of activity segments
		.filter(function (a) {
			return a.value[0].intVal === 1;
		}).map(function (b) {

			var startTime = new Date(b.startTimeNanos / 1000000);
			var endTime = new Date(b.endTimeNanos / 1000000);

			var durationMs = (b.endTimeNanos - b.startTimeNanos) / 1000000;

			var startLatLang = getClosestLatLng(locationPoints, b.startTimeNanos);
			var endLatLang = getClosestLatLng(locationPoints, b.endTimeNanos);

			return {
				startTime: startTime,
				endTime: endTime,
				startLatLang: startLatLang,
				endLatLang: endLatLang,
				durationMs: durationMs
			};
		});
	});
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (date) {
  return date.getTime() * 1000000;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (arr, n) {
  return arr.reduce(function (prevI, curr, i) {
    return Math.abs(curr - n) < Math.abs(arr[prevI] - n) ? i : prevI;
  }, 0);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);