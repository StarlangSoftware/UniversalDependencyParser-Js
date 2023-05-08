import {Model} from "nlptoolkit-classification/dist/Model/Model";
import {Decision} from "./Decision";
import {State} from "./State";
import {Candidate} from "./Candidate";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";

export abstract class Oracle {

    protected commandModel: Model
    protected windowSize: number

    protected constructor(model: Model, windowSize: number) {
        this.commandModel = model
        this.windowSize = windowSize
    }

    abstract makeDecision(state: State): Decision
    protected abstract scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision>

    protected findBestValidEagerClassInfo(probabilities: Map<string, number>, state: State): string{
        let bestValue = 0.0
        let best = ""
        for (let key in probabilities){
            if (probabilities.get(key) > bestValue){
                if (key == "SHIFT" || key == "RIGHTARC"){
                    if (state.wordListSize() > 0){
                        best = key
                        bestValue = probabilities.get(key)
                    }
                } else {
                    if (state.stackSize() > 1){
                        if (!(key == "REDUCE" && state.getPeek().getRelation() == null)){
                            best = key
                            bestValue = probabilities.get(key)
                        }
                    }
                }
            }
        }
        return best
    }

    protected findBestValidStandardClassInfo(probabilities: Map<string, number>, state: State): string{
        let bestValue = 0.0
        let best = ""
        for (let key in probabilities){
            if (probabilities.get(key) > bestValue){
                if (key == "SHIFT"){
                    if (state.wordListSize() > 0){
                        best = key
                        bestValue = probabilities.get(key)
                    }
                } else {
                    if (state.stackSize() > 1){
                        best = key
                        bestValue = probabilities.get(key)
                    }
                }
            }
        }
        return best
    }

    protected getDecisionCandidate(best: string): Candidate{
        let command, type
        if (best.includes("(")){
            command = best.substring(0, best.indexOf('('))
            let relation = best.substring(best.indexOf('(') + 1, best.indexOf(')'))
            type = UniversalDependencyRelation.getDependencyTag(relation)
        } else {
            command = best
            type = UniversalDependencyType.DEP
        }
        switch (command){
            case "SHIFT":
                return new Candidate(Command.SHIFT, type)
            case "REDUCE":
                return new Candidate(Command.REDUCE, type)
            case "LEFTARC":
                return new Candidate(Command.LEFTARC, type)
            case "RIGHTARC":
                return new Candidate(Command.RIGHTARC, type)
        }
        return null
    }
}