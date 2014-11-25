/**
 * Created by will.schick on 11/18/14.
 */
/**
 * Created by will.schick on 11/17/14.
 */


var portfolioController = angular.module("PortfolioController",["ngRoute","ngDragDrop","NotifiedResource"]);



portfolioController.controller("PortfoliosController",["$scope","notifiedResource",
    function($scope,notifiedResource) {

        var Portfolio = notifiedResource("portfolios");
        var Project = notifiedResource("projects");



        $scope.updatePortfolios = function() {
            var portfolios = Portfolio.query(function () {
                console.log(portfolios)

                portfolios.forEach(function (portfolio) {



                    for (var i = 0; i < portfolio.projects.length; i++) {
                        portfolio.projects[i] = Project.get({id: portfolio.projects[i].id});
                    }
                });

                $scope.portfolios = portfolios
            });
        }

        $scope.moveProjectToPortfolio= function(e1,e2,portfolio){

            portfolio.projects.forEach(function(project){

                if (project.portfolio.id != portfolio.id){
                    project.portfolio.id = portfolio.id;
                    project.$update();

                }
            });
        }


        var projectSubscription = Project.subscribe($scope.updatePortfolios);
        $scope.$on("$destroy", projectSubscription.unsubscribe);

        $scope.updatePortfolios();

        $scope.portfolios = []


    }
]);

portfolioController.controller("PortfolioController",["$scope","notifiedResource","$routeParams",
    function($scope,notifiedResource,$routeParams) {

        var Portfolio = notifiedResource("portfolios");
        var Project = notifiedResource("projects");


        $scope.portfolio = {}

        $scope.updatePortfolio = function(){
            var portfolio = Portfolio.get({id:$routeParams.id},function(){

                for (var i = 0; i < portfolio.projects.length; i++) {
                    portfolio.projects[i] = Project.get({id: portfolio.projects[i].id});
                }

                $scope.portfolio = portfolio
            })


        }

        var subscription = Project.subscribe($scope.updatePortfolio)

        $scope.$on("$destroy",subscription.unsubscribe);

        $scope.updatePortfolio();



    }
]);