package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/qualitativeEvaluation",formats = ["json"])
class QualitativeEvaluation extends NotifyingObject {

    QualitativeValue qualitativeValue;
    QualitativeCriterion qualitativeCriterion;
    String username;

    static belongsTo = [project:Project]

    static constraints = {
        qualitativeCriterion unique: ['username','project']
    }
}
