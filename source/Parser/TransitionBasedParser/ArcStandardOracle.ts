import {Oracle} from "./Oracle";
import {State} from "./State";
import {Decision} from "./Decision";
import {Model} from "nlptoolkit-classification/dist/Model/Model";
import {SimpleInstanceGenerator} from "./SimpleInstanceGenerator";

export class ArcStandardOracle extends Oracle{

    constructor(model: Model, windowSize: number) {
        super(model, windowSize)
    }

    public makeDecision(state: State): Decision {
        let instanceGenerator = new SimpleInstanceGenerator()
        let instance = instanceGenerator.generate(state, this.windowSize, "")
        let best = this.findBestValidStandardClassInfo(this.commandModel.predictProbability(instance), state);
        let decisionCandidate = this.getDecisionCandidate(best)
        if (decisionCandidate.getCommand() == Command.SHIFT) {
            return new Decision(Command.SHIFT, null, 0.0)
        }
        return new Decision(decisionCandidate.getCommand(), decisionCandidate.getUniversalDependencyType(), 0.0)
    }

    protected scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision> {
        return null
    }

}