/**
 * Created by will.schick on 11/18/14.
 */
/**
 * Created by will.schick on 11/17/14.
 */


var projectController = angular.module("ProjectController",["ngRoute","NotifiedResource","AuthService"]);




projectController.controller("ProjectController",["$scope","notifiedResource", "$routeParams","authService",
    function($scope,notifiedResource,$routeParams,authService) {


        var Project = notifiedResource("projects");
        var Portfolios = notifiedResource("portfolios");
        var QualitativeCriterion = notifiedResource("qualitativeCriterion");
        var QuantitativeCriterion = notifiedResource("quantitativeCriterion");
        var QualitativeValue = notifiedResource("qualitativeValue");
        var QualitativeEvaluation = notifiedResource("qualitativeEvaluation");
        var QuantitativeEvaluation = notifiedResource("quantitativeEvaluation");

        $scope.currentUser = authService.getUsername();
        $scope.project = {}
        $scope.users = {}
        $scope.qualitativeEvaluationsForUser = {}
        $scope.qualitativeEvaluationsForUser[$scope.currentUser] = {}
        $scope.quantitativeEvaluationsForUser = {}
        $scope.quantitativeEvaluationsForUser[$scope.currentUser] = {}
        $scope.quantitativeEvaluation = $scope.quantitativeEvaluationsForUser[$scope.currentUser]
        $scope.qualitativeEvaluation = $scope.qualitativeEvaluationsForUser[$scope.currentUser]






        $scope.handleQuantitativeCriteria = function(){
            $scope.quantitativeCriteria.forEach(function(criterion){

                if (!$scope.quantitativeEvaluation[criterion.id]) {
                    var e = new QuantitativeEvaluation();
                    e.value = null
                    e.quantitativeCriterion = criterion;
                    e.username = authService.getUsername();
                    e.project = {id: $routeParams.id};

                    $scope.quantitativeEvaluation[criterion.id] = e
                }
            })
        }

        $scope.handleQualitativeCriteria = function(){
            $scope.qualitativeCriteria.forEach(function(criterion){

                QualitativeCriterion.populateArray(QualitativeValue,criterion.allowedQualitativeValues)

                if (!$scope.qualitativeEvaluation[criterion.id]) {
                    var e = new QualitativeEvaluation();
                    e.qualitativeValue = null
                    e.qualitativeCriterion = criterion;
                    e.username = authService.getUsername();
                    e.project = {id: $routeParams.id};

                    $scope.qualitativeEvaluation[criterion.id] = e
                }
            })
        }

        $scope.quantitativeCriteria = QuantitativeCriterion.query($scope.handleQuantitativeCriteria);
        $scope.qualitativeCriteria = QualitativeCriterion.query($scope.handleQualitativeCriteria)

        $scope.saveEvaluation = function(){
            for (var id in $scope.qualitativeEvaluation) {
                if ($scope.qualitativeEvaluation.hasOwnProperty(id)) {
                        $scope.qualitativeEvaluation[id].$saveOrUpdate();
                }
            }
            for (var id in $scope.quantitativeEvaluation) {
                if ($scope.quantitativeEvaluation.hasOwnProperty(id)) {
                        $scope.quantitativeEvaluation[id].$saveOrUpdate();
                }
            }
        };


        $scope.updateQualitativeEvaluation = function(evaluation){

            evaluation.qualitativeValue = QualitativeValue.get({id:evaluation.qualitativeValue.id});

            if (!$scope.qualitativeEvaluationsForUser[evaluation.username])
                $scope.qualitativeEvaluationsForUser[evaluation.username] = {}

            $scope.qualitativeEvaluationsForUser[evaluation.username][evaluation.qualitativeCriterion.id] = evaluation

            $scope.users[evaluation.username] = evaluation.username
        };

        $scope.updateQuantitativeEvaluation = function(evaluation){

            if (!$scope.quantitativeEvaluationsForUser[evaluation.username])
                $scope.quantitativeEvaluationsForUser[evaluation.username] = {}

            $scope.quantitativeEvaluationsForUser[evaluation.username][evaluation.quantitativeCriterion.id] = evaluation

            $scope.users[evaluation.username] = evaluation.username
        }

        $scope.updateProject = function(){
            Project.get({id: $routeParams.id},function(project){
                $scope.project = project


                project.portfolio = Portfolios.get({id:project.portfolio.id})

                Project.populateArray(QualitativeEvaluation,project.qualitativeEvaluation,$scope.updateQualitativeEvaluation);

                Project.populateArray(QuantitativeEvaluation,project.quantitativeEvaluation,$scope.updateQuantitativeEvaluation);
            });

        }



        $scope.handleQualitativeEvaluation = function(id){

        }



        $scope.updateProject();

        Project.onUpdate(function(id){
            if (id == $scope.project.id) {
                $scope.updateProject();
            }
        })

        QualitativeEvaluation.onUpdate($scope.handleQualitativeEvaluation);
        QualitativeEvaluation.onCreate($scope.handleQualitativeEvaluation);



        var qualitattiveEvaluationSubscription = QualitativeEvaluation.subscribe(function(data){
                data = JSON.parse(data.body);


                var evaluation = QualitativeEvaluation.get({id:data.id},function(){
                    if (evaluation.project.id == $scope.project.id)
                        $scope.updateQualitativeEvaluation(evaluation)
                });

            }

        )

        var quantEvaluationSubscription = QuantitativeEvaluation.subscribe(function(data){
                data = JSON.parse(data.body);


                var evaluation = QuantitativeEvaluation.get({id:data.id},function(){
                    if (evaluation.project.id == $scope.project.id)
                        $scope.updateQuantitativeEvaluation(evaluation)
                });

            }

        )


        $scope.$on("$destroy", function() {


            quantEvaluationSubscription.unsubscribe();
            qualitattiveEvaluationSubscription.unsubscribe();
        });



    }
]);