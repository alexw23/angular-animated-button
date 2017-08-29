'use strict';

angular.module('angular-animated-button', []).
  directive('animatedButton', [ '$timeout', function($timeout) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        loading: '=',
        result: '=',
        invalid: '=',
        callback: '&',
        cancel: '&',
        inputOptions: '@options'
      },
      template:
        '<span>' +
          '<button type="submit" class="btn btn-ng-animated {{class}} {{options.size}} {{options.onlyIcons}} clearfix" ng-disabled="{{invalid}}" ng-click="callCallback()">' +
            '<span class="icons">' +
              '<i class="{{options.iconInitial}} icon-initial"></i>' +
              '<i class="{{options.iconSubmitting}} icon-spinner icon-submit hidden"></i>' +
              '<i class="{{options.iconSuccess}} icon-result icon-success hidden"></i>' +
              '<i class="{{options.iconError}} icon-result icon-error hidden"></i>' +
            '</span>' +
            '<span class="text">{{text}}</span>' +
          '</button>' +
          '<span ng-if="options.showCancel" class="btn {{options.classCancel}} {{options.size}}" ng-click="callCancel()" ng-disabled="loading">{{options.textCancel}}</span>' +
        '</span>',
        controller: [ '$scope', function(scope) {
          scope.options = !!scope.inputOptions.length ? scope.$eval(scope.inputOptions) : {};

          scope.options = {
            size:             scope.options.size             || '',
            classDefault:     scope.options.classDefault     || 'btn-primary',
            classSubmitting:  scope.options.classSubmitting  || 'btn-primary',
            classSuccess:     scope.options.classSuccess     || 'btn-success',
            classError:       scope.options.classError       || 'btn-danger',
            classCancel:      scope.options.classCancel      || 'btn-default',
            textDefault:      scope.options.textDefault      || 'Save',
            textSubmitting:   scope.options.textSubmitting   || 'Saving...',
            textSuccess:      scope.options.textSuccess      || 'Success',
            textError:        scope.options.textError        || 'Error',
            textCancel:       scope.options.textCancel       || 'Cancel',
            iconInitial:      scope.options.iconInitial      || '',
            iconSubmitting:   scope.options.iconSubmitting   || 'fa fa-spinner fa-pulse',
            iconSuccess:      scope.options.iconSuccess      || 'fa fa-check',
            iconError:        scope.options.iconError        || 'fa fa-times',
            resetTime:        scope.options.resetTime        || 2000,
            onlyIcons:        scope.options.onlyIcons        || false,
            showCancel:       scope.options.showCancel       || false
          };
      }],
      link: function(scope, element) {
        var el = element.children(':first');

        var icons = {
          initial: angular.element(el[0].querySelector('.icon-initial')),
          submitting: angular.element(el[0].querySelector('.icon-submit')),
          result: angular.element(el[0].querySelectorAll('.icon-result')),
          success: angular.element(el[0].querySelector('.icon-success')),
          error: angular.element(el[0].querySelector('.icon-error'))
        };

        var endAnimation = function() {
          scope.result = null;
          scope.class = scope.options.classDefault;
          scope.text = scope.options.textDefault;
          el.removeClass('is-active').attr('disabled', false);
          icons.result.addClass('hidden');
        };

        scope.callCallback = function() {
          if(scope.loading){
            return;
          }

          if(angular.isFunction(scope.callback)){
            scope.callback();
          }
        }

        scope.callCancel = function() {
          if(scope.loading){
            return;
          }

          if(angular.isFunction(scope.cancel)){
            scope.cancel();
          }
        }

        if(!!scope.options.onlyIcons){
          scope.onlyIcons = 'icons-only';
        };

        scope.class = scope.options.classDefault;
        scope.text  = scope.options.textDefault;

        if(!!scope.loading){
          el.addClass('is-active');
        }

        scope.$watch('loading', function(newValue) {
          if (newValue) {
            scope.class = scope.options.classSubmitting;
            scope.text  = scope.options.textSubmitting;
            el.attr('disabled', true).addClass('is-active');
            icons.submitting.removeClass('hidden');
          }
        }, true).bind(this);

        scope.$watch('result', function(newValue) {
          scope.loading = null;
          if (newValue === 'success') {
            scope.class = scope.options.classSuccess;
            scope.text  = scope.options.textSuccess;
            icons.submitting.addClass('hidden');
            icons.success.removeClass('hidden');
            $timeout(endAnimation, scope.options.resetTime);
          }
          if (newValue === 'error') {
            scope.class = scope.options.classError;
            scope.text  = scope.options.textError;
            icons.submitting.addClass('hidden');
            icons.error.removeClass('hidden');
            $timeout(endAnimation, scope.options.resetTime);
          }
        }, true).bind(this);
      }
    };
  }]
);
