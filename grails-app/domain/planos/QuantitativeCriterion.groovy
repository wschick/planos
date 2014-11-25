package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/quantitativeCriterion",formats = ["json"])
class QuantitativeCriterion extends NotifyingObject {

    String name;

    static constraints = {
    }

}
