
describe("ProjectController",function(){

    beforeEach(module("ProjectController"))

    describe("ProjectController",function(){

        var authService
        var notifiedResource
        var routeParams
        var scope

        var createController

        var getDomainMock

        beforeEach(module(function ($provide) {


            var domainMocks = {}

            getDomainMock = function(type){
                if (!domainMocks[type]) {

                    domainMocks[type] = jasmine.createSpy(type);
                    domainMocks[type].get = jasmine.createSpy()
                    domainMocks[type].query = jasmine.createSpy()
                    domainMocks[type].subscribe = jasmine.createSpy()
                    domainMocks[type].populateArray = jasmine.createSpy()
                    domainMocks[type].onUpdate = jasmine.createSpy(type + ".onUpdate")
                    domainMocks[type].onCreate = jasmine.createSpy(type + ".onCreate")
                }
                return domainMocks[type]
            }

            var notifiedResource = jasmine.createSpy().and.callFake(getDomainMock);
            $provide.value("notifiedResource",notifiedResource)
        }))

        beforeEach(inject(function($rootScope,$routeParams,_authService_,_notifiedResource_,$controller){
            authService = _authService_
            scope = $rootScope.$new()
            routeParams = $routeParams
            notifiedResource = _notifiedResource_

            createController = function(){
                return $controller('ProjectController', {
                    '$scope': scope
                });
            }

        }))

        it ("should create a controller",function(){
            expect(createController()).not.toBeFalsy();
        })

        describe("resource creation",function(){

            beforeEach(function(){
                createController();
            });

            it ("should create a 'projects' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("projects")
            })

            it ("should create a 'portfolios' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("portfolios")
            })

            it ("should create a 'qualitativeCriterion' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("qualitativeCriterion")
            })

            it ("should create a 'quantitativeCriterion' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("quantitativeCriterion")
            })

            it ("should create a 'qualitativeValue' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("qualitativeValue")
            })

            it ("should create a 'qualitativeEvaluation' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("qualitativeEvaluation")
            })

            it ("should create a 'quantitativeEvaluation' resource",function(){
                expect(notifiedResource).toHaveBeenCalledWith("quantitativeEvaluation")
            })
        })

        describe("controller objects",function(){
            beforeEach(function(){
                authService.setUsername("theuser")
                createController();
            });

            it("should get the current user from the auth service",function(){
                expect(scope.currentUser).toBe("theuser")
            })

            it("should have an empty project object",function(){
                expect(scope.project).toEqual({})
            })

            it("should have an empty users object",function(){
                expect(scope.users).toEqual({})
            })

            it("should have a map of qualitativeEvaluationsForUser, with an empty object for the current user",function(){
                expect(scope.qualitativeEvaluationsForUser).toEqual({theuser:{}})
            })

            it("should have a map of quantitativeEvaluationsForUser, with an empty object for the current user",function(){
                expect(scope.quantitativeEvaluationsForUser).toEqual({theuser:{}})
            })

            it("should have a map of quantitativeEvaluation object which points to the eval for the current user",function(){
                expect(scope.quantitativeEvaluation).toBe(scope.quantitativeEvaluationsForUser.theuser)
            })

            it("should have a map of qualitativeEvaluation object which points to the eval for the current user",function(){
                expect(scope.qualitativeEvaluation).toBe(scope.qualitativeEvaluationsForUser.theuser)
            })

            it("should have a qualitativeCriteria object that is fetched from a QualitativeCriteria query",function(){
                var QualitativeCriterion = notifiedResource("qualitativeCriterion")
                var result = {}
                QualitativeCriterion.query.and.returnValue(result)

                createController();

                expect(scope.qualitativeCriteria).toBe(result)
            })

            it ("should pass the handleQualitativeCriteria callback to QualitativeCriterion.query",function(){
                var QualitativeCriterion = notifiedResource("qualitativeCriterion")

                createController();

                expect(QualitativeCriterion.query).toHaveBeenCalledWith(scope.handleQualitativeCriteria)

            })

            it("should have a quantitativeCriteria object that is fetched from a QuantitativeCriterion query",function(){
                var QuantitativeCriterion = notifiedResource("quantitativeCriterion")
                var result = {}
                QuantitativeCriterion.query.and.returnValue(result)

                createController();

                expect(scope.quantitativeCriteria).toBe(result)
            })

            it ("should pass the handleQuantitativeCriteria callback to QuantitativeCriterion.query",function(){
                var QuantitativeCriterion = notifiedResource("quantitativeCriterion")

                createController();

                expect(QuantitativeCriterion.query).toHaveBeenCalledWith(scope.handleQuantitativeCriteria)
            })
        })

        describe("handleQuantitativeCriteria",function(){

            beforeEach(function(){
                authService.setUsername("theuser")
                createController();
            });

            describe("when an evaluation for that criteria exists for the current user",function(){

                it ("should not change the existing evalutation",function() {
                    var existingEval = {}

                    scope.quantitativeEvaluationsForUser[scope.currentUser][123] = existingEval

                    scope.quantitativeCriteria = [
                        {
                            id: 123
                        }
                    ]

                    scope.handleQuantitativeCriteria()

                    expect(scope.quantitativeEvaluationsForUser[scope.currentUser][123]).toBe(existingEval)

                })

            })

            describe("when an evaluation for that criteria does not exist for the current user",function(){

                var criterion =  {
                    id: 123
                }

                beforeEach(function(){
                    routeParams.id = 345
                    scope.quantitativeCriteria = [criterion]
                    scope.handleQuantitativeCriteria()
                })



                it ("should create a new evaluation",function() {
                    expect(notifiedResource("quantitativeEvaluation")).toHaveBeenCalled()

                })

                it ("should create a new evaluation with a null value",function() {
                    expect(scope.quantitativeEvaluationsForUser[scope.currentUser][123].value).toBeNull()

                })

                it ("should create a new evaluation with a username set to current user",function() {
                    expect(scope.quantitativeEvaluationsForUser[scope.currentUser][123].username).toBe(scope.currentUser)
                })

                it ("should create a new evaluation with a project with id equal to the current project id",function() {
                    expect(scope.quantitativeEvaluationsForUser[scope.currentUser][123].project.id).toBe(345)
                })

                it ("should create a new evaluation with the quantitativeCriterion field set to the criterion",function() {
                    expect(scope.quantitativeEvaluationsForUser[scope.currentUser][123].quantitativeCriterion).toBe(criterion)
                })

            })
        })

        describe("handleQualitativeCriteria",function(){

            beforeEach(function(){
                authService.setUsername("theuser")
                createController();
            });

            it ("should populate the criteria's allowed values",function(){

                var allowedValues = {}
                scope.qualitativeCriteria = [
                    {
                        id: 123,
                        allowedQualitativeValues: allowedValues
                    }
                ]

                scope.handleQualitativeCriteria()

                expect(notifiedResource("qualitativeCriterion").populateArray).toHaveBeenCalledWith(notifiedResource("qualitativeValue"),allowedValues)
            })

            describe("when an evaluation for that criteria exists for the current user",function(){

                it ("should not change the existing evalutation",function() {
                    var existingEval = {}

                    scope.qualitativeEvaluationsForUser[scope.currentUser][123] = existingEval

                    scope.qualitativeCriteria = [
                        {
                            id: 123
                        }
                    ]

                    scope.handleQualitativeCriteria()

                    expect(scope.qualitativeEvaluationsForUser[scope.currentUser][123]).toBe(existingEval)

                })

            })
            describe("when an evaluation for that criteria does not exist for the current user",function(){

                var criterion =  {
                    id: 123
                }

                beforeEach(function(){
                    routeParams.id = 345
                    scope.qualitativeCriteria = [criterion]
                    scope.handleQualitativeCriteria()
                })

                it ("should create a new evaluation",function() {
                    expect(notifiedResource("qualitativeEvaluation")).toHaveBeenCalled()

                })

                it ("should create a new evaluation with a null value",function() {
                    expect(scope.qualitativeEvaluationsForUser[scope.currentUser][123].qualitativeValue).toBeNull()

                })

                it ("should create a new evaluation with a username set to current user",function() {
                    expect(scope.qualitativeEvaluationsForUser[scope.currentUser][123].username).toBe(scope.currentUser)
                })

                it ("should create a new evaluation with a project with id equal to the current project id",function() {
                    expect(scope.qualitativeEvaluationsForUser[scope.currentUser][123].project.id).toBe(345)
                })

                it ("should create a new evaluation with the quantitativeCriterion field set to the criterion",function() {
                    expect(scope.qualitativeEvaluationsForUser[scope.currentUser][123].qualitativeCriterion).toBe(criterion)
                })
            })

        })

        describe("saveEvaluation",function(){

            beforeEach(function(){
                authService.setUsername("theuser")
                createController();
            });

            it ("should save or update all quantitative evaluations for the current user",function(){
                var eval = jasmine.createSpyObj("eval",["$saveOrUpdate"]);

                scope.quantitativeEvaluationsForUser[scope.currentUser][123] = eval;

                scope.saveEvaluation();

                expect(eval.$saveOrUpdate).toHaveBeenCalledWith()

            })

            it ("should save or update all qualitative evaluations for the current user",function(){
                var eval = jasmine.createSpyObj("eval",["$saveOrUpdate"]);

                scope.qualitativeEvaluationsForUser[scope.currentUser][123] = eval;

                scope.saveEvaluation();

                expect(eval.$saveOrUpdate).toHaveBeenCalledWith()

            })
        })

        describe("updateQualitativeEvaluation",function(){
            beforeEach(function(){
                createController();
            });

            it ("should fetch the evaluation qualitative value",function(){
                var result = {}

                notifiedResource("qualitativeValue").get.and.returnValue(result)

                var evaluation = {
                    qualitativeValue:{
                        id:123
                    },
                    qualitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQualitativeEvaluation(evaluation)

                expect(notifiedResource("qualitativeValue").get).toHaveBeenCalledWith({id:123})

                expect(evaluation.qualitativeValue).toBe(result)
            })

            it("should create an evaluations object for the evaluation objects user if it does not exist",function(){


                var evaluation = {
                    username: "arrrrg",
                    qualitativeValue:{
                        id:123
                    },
                    qualitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQualitativeEvaluation(evaluation)

                expect(scope.qualitativeEvaluationsForUser["arrrrg"]).toBeDefined()
            })

            it("should not create a new evaluations object if one already exists for that user",function(){

                var previousEvaluations = {}

                scope.qualitativeEvaluationsForUser["arrrrg"] = previousEvaluations


                var evaluation = {
                    username: "arrrrg",
                    qualitativeValue:{
                        id:123
                    },
                    qualitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQualitativeEvaluation(evaluation)

                expect(scope.qualitativeEvaluationsForUser["arrrrg"]).toBe(previousEvaluations)
            })

            it("should set the evaluation to the criterion id for that user in the qualitativeEvaluationsForUser map",function(){


                var evaluation = {
                    username: "arrrrg",
                    qualitativeValue:{
                        id:123
                    },
                    qualitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQualitativeEvaluation(evaluation)

                expect(scope.qualitativeEvaluationsForUser["arrrrg"][234]).toBe(evaluation)
            })

            it ("should set the evaluation username in the user map",function(){
                var evaluation = {
                    username: "arrrrg",
                    qualitativeValue:{
                        id:123
                    },
                    qualitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQualitativeEvaluation(evaluation)

                expect(scope.users["arrrrg"]).toBe("arrrrg")
            })
        })

        describe("updateQuantitativeEvaluation",function(){
            beforeEach(function(){
                createController();
            });

            it("should create an evaluations object for the evaluation objects user if it does not exist",function(){

                var evaluation = {
                    username: "arrrrg",

                    quantitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQuantitativeEvaluation(evaluation)

                expect(scope.quantitativeEvaluationsForUser["arrrrg"]).toBeDefined()
            })

            it("should not create a new evaluations object if one already exists for that user",function(){

                var previousEvaluations = {}

                scope.quantitativeEvaluationsForUser["arrrrg"] = previousEvaluations

                var evaluation = {
                    username: "arrrrg",

                    quantitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQuantitativeEvaluation(evaluation)

                expect(scope.quantitativeEvaluationsForUser["arrrrg"]).toBe(previousEvaluations)
            })


            it("should set the evaluation to the criterion id for that user in the qualitativeEvaluationsForUser map",function(){


                var evaluation = {
                    username: "arrrrg",
                    quantitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQuantitativeEvaluation(evaluation)

                expect(scope.quantitativeEvaluationsForUser["arrrrg"][234]).toBe(evaluation)
            })

            it ("should set the evaluation username in the user map",function(){
                var evaluation = {
                    username: "arrrrg",
                    quantitativeCriterion:{
                        id:234
                    }
                }

                scope.updateQuantitativeEvaluation(evaluation)

                expect(scope.users["arrrrg"]).toBe("arrrrg")
            })

        })

        describe("updateProject",function(){

            beforeEach(function(){
                createController();
            });

            it("should call Project.get with the id given by route params, and a callback",function(){
                routeParams.id = 567

                scope.updateProject()

                expect(notifiedResource("projects").get).toHaveBeenCalledWith({id:567},jasmine.any(Function))
            })

            describe("updateProject callback",function(){
                var callback


                beforeEach(function(){
                    notifiedResource("projects").get.and.callFake(function(query,c){
                        callback = c
                    })
                    scope.updateProject()
                })

                it ("should set the scope.project to given project",function(){
                    var project = {
                        portfolio:{
                            id:1234
                        }
                    }
                    callback(project)

                    expect(scope.project).toBe(project)
                })

                it ("should populate the project.portfolio",function(){
                    var project = {
                        portfolio:{
                            id:1234
                        }
                    }

                    notifiedResource("portfolios").get.and.returnValue("qwert")

                    callback(project)

                    expect(notifiedResource("portfolios").get).toHaveBeenCalledWith({id:1234})

                    expect(scope.project.portfolio).toBe("qwert")
                })

                it ("should populate the project qualitativeEvalutaion array",function(){
                    var project = {
                        portfolio:{
                            id:1234
                        },
                        qualitativeEvaluation : "ruff"
                    }

                    callback(project)

                    expect(notifiedResource("projects").populateArray).toHaveBeenCalledWith(notifiedResource("qualitativeEvaluation"),"ruff",scope.updateQualitativeEvaluation)
                })

                it ("should populate the project quantitativeEvaluation array",function(){
                    var project = {
                        portfolio:{
                            id:1234
                        },
                        quantitativeEvaluation : "ruff"
                    }

                    callback(project)

                    expect(notifiedResource("projects").populateArray).toHaveBeenCalledWith(notifiedResource("quantitativeEvaluation"),"ruff",scope.updateQuantitativeEvaluation)
                })
            })
        })

        describe("resource notifications",function(){
            describe("project subscription",function(){
                it ("should subscribe to project onUpdate",function(){
                    createController();

                    expect(notifiedResource("projects").onUpdate).toHaveBeenCalledWith(jasmine.any(Function));
                })

                describe("project.onUpdate callback",function(){

                    var callback

                    beforeEach(function(){
                        notifiedResource("projects").onUpdate.and.callFake(function(c){
                            callback = c
                        })
                        createController();
                    })

                    it ("should not update the project if the update id is not the project.id of the scope",function(){
                        spyOn(scope,'updateProject')

                        scope.project.id = 345

                        callback(123)

                        expect(scope.updateProject).not.toHaveBeenCalled()

                    })

                    it ("should update the project if the update id is the project.id of the scope",function(){
                        spyOn(scope,'updateProject')

                        scope.project.id = 123

                        callback(123)

                        expect(scope.updateProject).toHaveBeenCalled()

                    })
                })
            })

            describe("QualitativeEvaluation subscriptions",function(){

                it ("should subscribe to project onUpdate",function(){
                    createController();

                    expect(notifiedResource("qualitativeEvaluation").onUpdate).toHaveBeenCalledWith(scope.handleQualitativeEvaluation);
                })

                it ("should subscribe to project onCreate with handleQualitativeEvaluation",function(){
                    createController();

                    expect(notifiedResource("qualitativeEvaluation").onCreate).toHaveBeenCalledWith(scope.handleQualitativeEvaluation);
                })

                describe("handleQualitativeEvaluation",function(){

                    var callback = null

                    beforeEach(function(){
                        createController()
                    })
                    it ("should fetch the evaluation",function(){
                        scope.handleQualitativeEvaluation(1234)

                        expect(notifiedResource("qualitativeEvaluation").get).toHaveBeenCalledWith({id:1234},jasmine.any(Function))
                    })

                    it("should fetch the evaluation with a callback that calls updateQualitativeEvaluation if the evaluation project.id equals the scope project id",function(){
                        notifiedResource("qualitativeEvaluation").get.and.callFake(function(data,c){
                            callback = c
                        })

                        spyOn(scope,"updateQualitativeEvaluation")

                        scope.project.id = 456
                        scope.handleQualitativeEvaluation(1234);

                        var evaluation = {
                            project:{
                                id:456
                            }
                        }

                        callback(evaluation)

                        expect(scope.updateQualitativeEvaluation).toHaveBeenCalledWith(evaluation)


                    })

                    it("should fetch the evaluation with a callback that does not call updateQualitativeEvaluation if the evaluation project.id does not equal the scope project id",function(){
                        notifiedResource("qualitativeEvaluation").get.and.callFake(function(data,c){
                            callback = c
                        })

                        spyOn(scope,"updateQualitativeEvaluation")

                        scope.project.id = 567

                        scope.handleQualitativeEvaluation(1234);

                        var evaluation = {
                            project:{
                                id:456
                            }
                        }

                        callback(evaluation)

                        expect(scope.updateQualitativeEvaluation).not.toHaveBeenCalled()


                    })
                })

            })
        })
    })
})