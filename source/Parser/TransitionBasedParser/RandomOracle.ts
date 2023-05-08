import {Oracle} from "./Oracle";
import {State} from "./State";
import {Decision} from "./Decision";
import {Model} from "nlptoolkit-classification/dist/Model/Model";
import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";

export class RandomOracle extends Oracle{

    constructor(model: Model, windowSize: number) {
        super(model, windowSize)
    }

    public makeDecision(state: State): Decision {
        let command = Math.floor(Math.random() * 3)
        let relation = Math.floor(Math.random() * 58)
        switch (command){
            case 0:
                return new Decision(Command.LEFTARC, UniversalDependencyRelation.universalDependencyTags[relation], 0)
            case 1:
                return new Decision(Command.RIGHTARC, UniversalDependencyRelation.universalDependencyTags[relation], 0)
            case 2:
                return new Decision(Command.SHIFT, UniversalDependencyType.DEP, 0)
        }
        return null
    }

    protected scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision> {
        return null;
    }

}