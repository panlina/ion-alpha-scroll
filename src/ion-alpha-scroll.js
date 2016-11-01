angular.module('ion-alpha-scroll', [])
.directive('ionAlphaScroll', [
	'$ionicScrollDelegate', '$location', '$timeout', '$document',
	function ($ionicScrollDelegate, $location, $timeout, $document){
		return{
			require: '?ngModel',
			restrict: 'AE',
			replace: true,
			compile: function(tElement, tAttrs, tTransclude){
				var children = tElement.contents();
				var template = angular.element([
					'<ion-list class="ion_alpha_list_outer">',
						'<div data-ng-repeat="(letter, items) in sorted_items" class="ion_alpha_list">',
							'<ion-item class="item item-divider" id="index_{{letter}}">{{letter}}</ion-item>',
							'<ion-item ng-repeat="item in items"></ion-item>',
						'</div>',
					'</ion-list>'
					].join(''));

				angular.element(template.find('ion-item')[1]).append(children);
				tElement.html('');
      			tElement.append(template);
				
				return function (scope, element, attrs, ngModel) {
	                // do nothing if the model is not set
	                if (!ngModel) return;

	                ngModel.$render = function(){
						scope.items = [];                	
	                	scope.items = ngModel.$viewValue;
		                var tmp={};
			            for(i=0;i<scope.items.length;i++){
			              var letter=scope.items[i][attrs.key].toUpperCase().charAt(0);
			              if( tmp[ letter] ==undefined){
			              tmp[ letter]=[]
			            }
			              tmp[ letter].push( scope.items[i] );
			            }
			            scope.sorted_items = tmp;
	                };

	            }
	        }
        };
	}])
.directive('alphaBar', [
	'$ionicScrollDelegate', '$location', '$timeout', '$document',
	function ($ionicScrollDelegate, $location, $timeout, $document) {
		return {
			require: '?ngModel',
			restrict: 'AE',
			replace: true,
			compile: function (tElement, tAttrs, tTransclude) {
				var children = tElement.contents();
				var template = angular.element([
					'<ul class="ion_alpha_sidebar">',
						'<li ng-click="alphaScrollGoToList(\'index_{{letter}}\')" ng-repeat="letter in alphabet">{{$index%2 == 0 ? letter: "&bull;"}}</li>',
					'</ul>'
				].join(''));

				var headerHeight = $document[0].body.querySelector('.bar-header').offsetHeight;
				var subHeaderHeight = tAttrs.subheader === "true" ? 44 : 0;
				var tabHeight = $document[0].body.querySelector('.tab-nav') ? $document[0].body.querySelector('.tab-nav').offsetHeight : 0;
				var windowHeight = window.innerHeight;

				var contentHeight = windowHeight - headerHeight - subHeaderHeight - tabHeight;

				tElement.html('');
				tElement.append(template);

				tElement.find('ul').css({ "top": headerHeight + subHeaderHeight + tabHeight + 'px' });

				return function (scope, element, attrs, ngModel) {
					scope.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

					scope.alphaScrollGoToList = function (id) {
						$location.hash(id);
						$ionicScrollDelegate.$getByHandle(attrs.delegateHandle).anchorScroll();
					}

				}
			}
		};
	}]);