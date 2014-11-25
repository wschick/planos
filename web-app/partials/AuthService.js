/**
 * Created by will.schick on 11/21/14.
 */
var authService = angular.module("AuthService",[])

authService.factory("authService",function(){

    var username = undefined;

    return {
        getUsername:function(){
            return username
        },
        isLoggedIn:function(){
            return !!username
        },
        setUsername:function(u){
            username = u
        }

    }
})

authService.controller("LoginController",["authService","$scope","$location",function(authService,$scope,$location){

    $scope.login = function(){
        authService.setUsername($scope.username)

        $location.path("/portfolios");
    }
}]);