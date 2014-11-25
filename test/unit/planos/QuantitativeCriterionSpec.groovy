package planos

import grails.rest.Resource
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin} for usage instructions
 */
@TestFor(QuantitativeCriterion)
class QuantitativeCriterionSpec extends Specification {

    void "it should have the resource annotation with correct uri"() {
        expect:
        "it will have the resource annotation with correct uri"
        QuantitativeCriterion.class.getAnnotation(Resource).uri() == "/quantitativeCriterion"
    }
}
