/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

// setup pokedex controller
angular.module('adminApp').controller('pokedexController', ['$scope', '$http',
    function ($scope, $http, $uibModal, $filter) {
        $scope.getPokemon = function() {
            $http({
                method: 'GET',
                url: ('http://pokeapi.co/api/v2/pokemon/' + $scope.pokemonName + '/')
            }).then(function (response) {
                $scope.pokemon = response.data;
                $scope.pokemon.name = $scope.pokemon.name.charAt(0).toUpperCase() + $scope.pokemon.name.slice(1);
                $scope.pokemonIconURL = 'http://pokedream.com/pokedex/images/blackwhite/front/' + $scope.pad(response.data.id, 3) + '.png';
            }, function (err) {
                if ($scope.pokemon != null) {
                    $scope.pokemon = null;
                }

                console.log(err);
            });
        }

        $scope.pad = function(stringToPad, width, paddingCharacter) {
            paddingCharacter = paddingCharacter || '0';
            stringToPad = stringToPad + '';
            return stringToPad.length >= width ? stringToPad : new Array(width - stringToPad.length + 1).join(paddingCharacter) + stringToPad;
        }
    }]);