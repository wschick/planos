/**
 * Created by will.schick on 11/18/14.
 */

describe("PorfolioController", function () {

    var notifiedResource
    var Portfolio
    var Project

    var scope

    var controller

    var projectSubscription;

    beforeEach(module("PortfolioController"));



    describe("PorfoliosController", function () {

        beforeEach(module(function ($provide) {

            projectSubscription = jasmine.createSpyObj("projectSubscription", ["unsubscribe"]);

            Portfolio = jasmine.createSpyObj("Portfolio", ["query"])
            Project = jasmine.createSpyObj("Project", ["get", "subscribe"])
            Project.subscribe.and.returnValue(projectSubscription);

            $provide.value("notifiedResource", jasmine.createSpy().and.callFake(function (name) {
                if (name == "portfolios") return Portfolio;
                if (name == "projects") return Project;
                throw "unkown resource"
            }))
        }))

        beforeEach(inject(function ($rootScope, _notifiedResource_, $controller) {
            scope = $rootScope.$new()
            notifiedResource = _notifiedResource_


            controller = $controller('PortfoliosController', {
                '$scope': scope
            });
        }))

        it ("should create a Portfolio resource",function(){
            expect(notifiedResource).toHaveBeenCalledWith("portfolios")
        });

        it ("should create a Project resource",function(){
            expect(notifiedResource).toHaveBeenCalledWith("projects")
        });

        it("should have 'portfolios' defined", function () {
            expect(scope.portfolios).toBeDefined();
        })

        it("should have 'updatePortfolios' defined", function () {
            expect(scope.updatePortfolios).toBeDefined();
        });

        it("should subscribe to updates from the project resource", function () {
            expect(Project.subscribe).toHaveBeenCalledWith(scope.updatePortfolios);
        });

        it("should unsubscribe to updates from Project when destroyed", function () {
            scope.$broadcast('$destroy');
            expect(projectSubscription.unsubscribe).toHaveBeenCalled();
        });

        describe("update portfolios", function () {
            it("should query portfolios", function () {
                scope.updatePortfolios();
                expect(Portfolio.query).toHaveBeenCalled();
            })

            describe("populating portfolio projects", function () {

                var callback
                beforeEach(function () {
                    Portfolio.query.and.callFake(function (c) {
                        callback = c;
                        return [
                            {projects: [
                                {id: 1234},
                                {id: 3456}
                            ]},
                            {projects: [
                                {id: 2345}
                            ]}
                        ]
                    })

                    Project.get.and.callFake(function (params) {
                        return {id: params.id, name: "result-" + params.id};
                    })
                });

                it("should set the scopes portfolio object", function () {
                    scope.updatePortfolios();
                    expect(Portfolio.query).toHaveBeenCalledWith(callback);
                    callback();

                    expect(scope.portfolios.length).toBe(2);

                })

                it("should query all projects in portfolios when query is successful", function () {
                    scope.updatePortfolios();
                    expect(Portfolio.query).toHaveBeenCalledWith(callback);
                    callback();

                    expect(Project.get).toHaveBeenCalledWith({id: 1234})
                    expect(Project.get).toHaveBeenCalledWith({id: 3456})
                    expect(Project.get).toHaveBeenCalledWith({id: 2345})
                })

                it("should update the project object with the get result", function () {
                    scope.updatePortfolios();
                    expect(Portfolio.query).toHaveBeenCalledWith(callback);
                    callback();

                    expect(Project.get).toHaveBeenCalledWith({id: 1234})
                    expect(Project.get).toHaveBeenCalledWith({id: 3456})
                    expect(Project.get).toHaveBeenCalledWith({id: 2345})

                    expect(scope.portfolios).toEqual([
                        {projects: [
                            {id: 1234, name: "result-1234"},
                            {id: 3456, name: "result-3456"}
                        ]},
                        {projects: [
                            {id: 2345, name: "result-2345"}
                        ]}
                    ]);
                })
            })
        })

        describe("moveProjectToPortfolio", function () {
            it("should update the portfolio id of contained projects to the id of the given portfolio", function () {

                var project = {portfolio: {id: 234}, $update: jasmine.createSpy()};

                scope.moveProjectToPortfolio(null, null, {id: 123, projects: [
                    project
                ]})

                expect(project.portfolio.id).toBe(123)
            })

            it("should call update on projects which have changed", function () {

                var project = {portfolio: {id: 234}, $update: jasmine.createSpy()};

                scope.moveProjectToPortfolio(null, null, {id: 123, projects: [
                    project
                ]})

                expect(project.$update).toHaveBeenCalled()
            })

            it("should not call update on projects which have not changed", function () {

                var project = {portfolio: {id: 123}, $update: jasmine.createSpy()};

                scope.moveProjectToPortfolio(null, null, {id: 123, projects: [
                    project
                ]})

                expect(project.$update).not.toHaveBeenCalled()
            })

        });
    });

    describe("PortfolioController",function(){

        beforeEach(module(function ($provide) {

            projectSubscription = jasmine.createSpyObj("projectSubscription", ["unsubscribe"]);

            Portfolio = jasmine.createSpyObj("Portfolio", ["get"])
            Project = jasmine.createSpyObj("Project", ["get", "subscribe"])
            Project.subscribe.and.returnValue(projectSubscription);

            $provide.value("notifiedResource", jasmine.createSpy().and.callFake(function (name) {
                if (name == "portfolios") return Portfolio;
                if (name == "projects") return Project;
                throw "unkown resource"
            }))

            $provide.value("$routeParams",{id:3})
        }))

        beforeEach(inject(function ($rootScope, _notifiedResource_, $controller) {
            scope = $rootScope.$new()
            notifiedResource = _notifiedResource_


            controller = $controller('PortfolioController', {
                '$scope': scope
            });
        }))

        it ("should create a Portfolio resource",function(){
            expect(notifiedResource).toHaveBeenCalledWith("portfolios")
        });

        it ("should create a Project resource",function(){
            expect(notifiedResource).toHaveBeenCalledWith("projects")
        });

        it ("should have and update portfolio method",function(){
            expect(scope.updatePortfolio).toBeDefined();
        })

        it ("should subscribe to Project notifications",function(){
            expect(Project.subscribe).toHaveBeenCalledWith(scope.updatePortfolio);
        });

        it("should unsubscribe to updates from Project when destroyed", function () {
            scope.$broadcast('$destroy');
            expect(projectSubscription.unsubscribe).toHaveBeenCalled();
        });

        it("should have an empty portfolio object",function(){
            expect(scope.portfolio).toEqual({})
        })


        describe("updatePortfolios",function(){


            it ("should get the portfolio given by the route param",function(){
                scope.updatePortfolio()

                expect(Portfolio.get).toHaveBeenCalledWith({id:3},jasmine.any(Function));
            })

            it ("should request project items when get succeeds",function(){

                var callback


                Portfolio.get.and.callFake(function (id,c) {
                    callback = c;
                    return  {projects: [
                            {id: 1234},
                            {id: 3456}
                        ]}

                })

                Project.get.and.callFake(function (params) {
                    return {id: params.id, name: "result-" + params.id};
                })

                scope.updatePortfolio();
                callback();

                expect(Project.get).toHaveBeenCalledWith({id:1234});
                expect(Project.get).toHaveBeenCalledWith({id:3456});

            })

            it ("should set scope.portfolio when it succeeds",function(){

                var callback


                Portfolio.get.and.callFake(function (id,c) {
                    callback = c;
                    return  {projects: [
                        {id: 1234},
                        {id: 3456}
                    ]}

                })

                Project.get.and.callFake(function (params) {
                    return {id: params.id, name: "result-" + params.id};
                })

                scope.updatePortfolio();
                callback();

                expect(scope.portfolio).toEqual({ projects: [ { id: 1234, name: 'result-1234' }, { id: 3456, name: 'result-3456' } ] });

            })
        })
    })

});
