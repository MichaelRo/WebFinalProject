/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

'use strict';

// create admin sub-app
var app = angular.module('adminApp', ['ui.bootstrap', 'ui.router', 'ui.router.tabs', 'ui.grid']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '../partials/login.html',
            controller: 'adminController',
            access: {restricted: false}
        })
        .state('logout', {
            url: '/login',
            templateUrl: '../partials/login.html',
            controller: 'adminController',
            access: {restricted: false}
        })
        .state('dashboard', {
            url: '/',
            templateUrl: '../partials/dashboard.html',
            controller: 'adminController',
            access: {restricted: true}
        })
        .state('dashboard.stats', {
            url: 'stats',
            controller: 'statsController',
            templateUrl: '../partials/stats.html',
            access: {restricted: true}
        })
        .state('dashboard.pokedex', {
            url: 'pokedex',
            controller: 'pokedexController',
            templateUrl: '../partials/pokedex.html',
            access: {restricted: false}
        })
        .state('dashboard.messages', {
            url: 'messages',
            controller: 'messagesController',
            templateUrl: '../partials/messages.html',
            access: {restricted: true}
        });

    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/login");
});

app.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.access && toState.access.restricted && !AuthService.isLoggedIn()){
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }
        else if (toState.name === "logout" && AuthService.isLoggedIn()) {
            AuthService.logout();
        }
    });
});

$(document).ready(function () {
    var canvasLogo = $('#logo')[0];
    var context = canvasLogo.getContext('2d');
    var image = new Image;

    image.onload = function(){
        context.drawImage(image, 0, 0, image.width,    image.height,    // source rectangle
            0, 0, canvasLogo.width, canvasLogo.height);
    };

    // set image src
    image.src = "data:image/png;base64,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";
});