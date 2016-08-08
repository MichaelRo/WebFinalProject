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
            access: {restricted: true},
        })
        .state('dashboard.stats', {
            url: 'stats',
            controller: 'statsController',
            templateUrl: '../partials/stats.html',
            access: {restricted: true}
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
        else if (toState.name === "logout" && AuthService.isLoggedIn()){
            AuthService.logout();
        }
    });
});




$(document).ready(function () {

    var canvas = $('#logo')[0];
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.onload = function(){
        ctx.drawImage(img,0,0);
    };
    // set image src
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEvklEQVRIS4VVfUxbVRQ/577S4dxki4SpiV+Ii4NMRwtLJqwtuCxZkLbMsKBEY/xa1Cwxim6yMFHjBxqdJkt0mpho5tzEsLbELDKFtjMmjD3KH8PPDTcZRsEsEB1jpe8ez32l2L4WvP/09Z5zfuee3/ndcxEWWZXV9xQbWqIJJNSQMMrYtVC5C9AmSML3KKjXQPHZUDhwdiEYzGVY76q/mQPfAJBbGU4oHwkwzR9/zn2v4u+lyVjJJvxCarbnYr1d56x4WQkq3P77DaD3TQAJ5wDhPRAyqIe7f+JgmgNAh6vhNkTDL4EeFyCuZ9+LhLR9MBr6ND1JRgKny7eTAV/nU8URtDb6p2ivrn8wuxiNZWWN9iWF8RYCo52pywPCFj0aeCsVM59AnZyAPuGKJwWKuoFo8LvFgK22cpfXJYhCzGgB19msR4MHlY+ZQHE+i+KUAGkTJGpygc/15Yzy10jeciLa/as1SWVNgzuRkF8zzgwnKdO/7f7NTOB0+z9nehsRcOfJSICbm7lu37z5yryZ/EcA8R3TgtRm0+DD/m9CZtPTl9Pt28P/X+RmHRqMBO9FJUWpxX8BKUZhetWtVs4ra+rLpBQ9HHRdOlBSVfSgHgl1pu+XbNmypGDaPsJ9vEZqecXocPtauYxXuKRdzFuH9UQOt/8EAlVKkBeQxB4UcFkSsnLIwQKdsSGsZkpHc1WhMNGx0XeMgzYByjUsxR/THddW1620a7YLao9LDnHJPvW9zuNfoUl4GAQLEygwGA6dTo8rr2m4Q0g5xDE9WO6++3duW0EsElyWxPlvbdjQeMWM/dKUKT/TRl/ybx9ICuvHu2NW/1RkY2OjNvJH/CL7T6gEcQY4r0eCxVZ61P8Kj28fETyZZSMYY4DdejT0ca4450bvKFdY9L8JANqF0xN7iAgf415UKA2lAXJucDN1x7PUlErAshpjRazIRZE1aP1dDVfLWaMqQfCsJrDatCO+q4cDT6X7mhSNz0yDxPH5JhOJ0sHokR+sapAGPAGaIW2AvoFI94CyV3p8myTBsaQvvq1HAs+kx1V6/OskUQyIvkKn2/s8O73KfLaypl9Ld+SBtgYxMcQT1W4OM4Au5mfSEFSnAXLPWKhC3Kn3Bfsz47wvIGK7urjIkrtJI+MM0zQW/yu/ZHi4M55Rhcfv55N8xHsr0/c52d9ItMPaZI/Hkz9Fy0aYniJBUDw3KryHuYptHLSbG8bVZK6qKu/ySxo+gAj7krTTjgSIA/zQTFp9y93elwRgG1/Mg7FId7OZoLx2641i1hiWwrADiU2xaChqDVSVIiV+VvuEttW5XjGHq76WZdWDQkznoVbaH+46Py85h8vbzLwdYFqnhM3mG+g7ErEmWey/AgcUAQZczkmaBqNBZiVT0+D0+Fr4vr7JrUvwQ/ny1NJ4x+mjRy8vBpzk/KpWvt2tQgiNEzx9MhLcm4rJejL5VbsPSO5ndajRwWME9kshgiWFtlOdnZ2GClQ6Pzsxu9aQ0kcot/MkuFY1nQ/3aOrkCyZQBmd1/Q2kiQ4EuS316LNMuRKaMAN5BJjS5SUl3xQBh20kdlmnahZFWYpQzU8YTYRQi5JKk8AKFcd5YAwjil4yjEPq5VqIxn8BcgcUBxUIGZcAAAAASUVORK5CYII=";

});