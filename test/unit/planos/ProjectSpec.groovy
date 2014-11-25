package planos

import grails.rest.Resource
import grails.test.mixin.TestFor
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(Project)
@TestMixin(GrailsUnitTestMixin)
class ProjectSpec extends Specification {

    void "it should have the resource annotation with correct uri"() {
        expect:
        "it will have the resource annotation with correct uri"
        Project.class.getAnnotation(Resource).uri() == "/projects"
    }
}
