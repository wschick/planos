var app = angular.module('planos', ['ngRoute',"PortfolioController","ProjectController","NotifiedResource","AuthService"]);


app.controller("StartupController",["notificationService","$location","$scope",function(notificationService,$location,$scope){
    notificationService.connect({},function(){
        $location.path("/portfolios");
        $scope.$apply();
    })
}])

app.config(function ($routeProvider){

    $routeProvider
        .when('/portfolios', {
            templateUrl: 'portfolios.html',
            controller: 'PortfoliosController'
        })
        .when('/portfolio/:id', {
            templateUrl: 'portfolio.html',
            controller: 'PortfolioController'
        })
        .when('/projects/:id', {
            templateUrl: 'project.html',
            controller: 'ProjectController'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .when('/', {
            templateUrl: 'startup.html',
            controller: 'StartupController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.run( function($rootScope, $location,notificationService,authService) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {

        console.log(notificationService)

        if ( !notificationService.connected) {

                $location.path( "/" );

        } else if (!authService.isLoggedIn()){

                $location.path("/login")
        }
    });
})