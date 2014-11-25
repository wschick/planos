import planos.Portfolio
import planos.Project
import planos.QualitativeCriterion
import planos.QualitativeValue
import planos.QuantitativeCriterion

class BootStrap {

    def init = { servletContext ->
        try {

            for (int j = 0; j < 3; j++) {
                Portfolio portfolio1 = new Portfolio(name: "Portfolio ${j}");
                portfolio1 = portfolio1.save(flush: true, failOnError: true);

                for (int i = 0; i < 3; i++) {
                    Project project = new Project(creator: "arg", description: "ruff", name: "portfolio ${j} project ${i}")

                    portfolio1.addToProjects(project);
                    project.save(flush: true, failOnError: true);
                    portfolio1.save(flush: true, failOnError: true);
                }
            }

            new QuantitativeCriterion(name: "Number of poodles provided").save(flush: true,failOnError: true);
            new QuantitativeCriterion(name: "Number of hours of pain inflicted per week").save(flush: true,failOnError: true);
            new QuantitativeCriterion(name: "Smiles provided").save(flush: true,failOnError: true);


            def o1 = new QualitativeValue(name: "very much").save(flush: true,failOnError: true);
            def o2 = new QualitativeValue(name: "a little").save(flush: true,failOnError: true);
            def o3 = new QualitativeValue(name: "not much").save(flush: true,failOnError: true);
            def o4 =new QualitativeValue(name: "none").save(flush: true,failOnError: true);

            def o5 = new QualitativeValue(name: "I strongly agree").save(flush: true,failOnError: true);
            def o6 = new QualitativeValue(name: "I not-very-strongly agree").save(flush: true,failOnError: true);
            def o7 = new QualitativeValue(name: "I don't care").save(flush: true,failOnError: true);
            def o8 = new QualitativeValue(name: "I disagree, but will not say anything, I will only make passive-aggressive comments about your clothing choices").save(flush: true,failOnError: true);
            def o9 = new QualitativeValue(name: "I strongly disagree").save(flush: true,failOnError: true);

            new QualitativeCriterion(name: "This project helps me be a better person",allowedQualitativeValues: [o1,o2,o3,o4]).save(flush: true,failOnError: true);

        }catch (Throwable e){
            e.printStackTrace();
            System.exit(123);
        }
    }
    def destroy = {
    }
}
