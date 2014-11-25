package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/quantitativeEvaluation",formats = ["json"])
class QuantitativeEvaluation extends NotifyingObject {

    QuantitativeCriterion quantitativeCriterion;
    Float value;
    String username;
    static belongsTo = [project:Project]


    static constraints = {
        quantitativeCriterion unique: ['username','project']
    }
}
