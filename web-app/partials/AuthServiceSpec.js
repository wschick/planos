/**
 * Created by will.schick on 11/21/14.
 */
describe("AuthService",function(){

    var authService

    beforeEach(module("AuthService"))

    describe("authService",function() {

        beforeEach(inject(function (_authService_) {
            authService = _authService_
        }))

        describe("isLoggedIn", function () {
            it("should return false if no username is set", function () {
                expect(authService.isLoggedIn()).toBe(false);
            })

            it("should return true if the username is set", function () {
                authService.setUsername("bob");

                expect(authService.isLoggedIn()).toBe(true);

            })
        })

        describe("getUsername", function () {
            it("should return the username", function () {
                authService.setUsername("bob")

                expect(authService.getUsername()).toBe("bob")
            })
        })
    })

    describe("LoginController",function() {

        var scope
        var controller
        var location

        beforeEach(inject(function (_authService_,$controller,$rootScope,$location) {
            authService = _authService_
            location = $location
            scope = $rootScope.$new()


            controller = $controller('LoginController', {
                '$scope': scope
            });
        }))

        describe("login",function(){
            it ("should set the authService username from scope.username",function(){
                scope.username = "ARRRRG"

                scope.login()

                expect(authService.getUsername()).toBe("ARRRRG")
            })

            it ("should set the location to be /",function(){
                spyOn(location,"path")

                scope.login()

                expect(location.path).toHaveBeenCalledWith("/portfolios")

            })
        })
    })


})