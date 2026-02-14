import {Model} from "nlptoolkit-classification/dist/Model/Model";
import {Decision} from "./Decision";
import {State} from "./State";
import {Candidate} from "./Candidate";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import {TransitionSystem} from "./TransitionSystem";
import {Command} from "./Command";

export abstract class Oracle {

    protected commandModel: Model
    protected windowSize: number

    /**
     * Constructs an Oracle with the given model and window size.
     * @param model the model used for making predictions
     * @param windowSize the size of the window used in parsing
     */
    protected constructor(model: Model, windowSize: number) {
        this.commandModel = model
        this.windowSize = windowSize
    }

    /**
     * Abstract method to be implemented by subclasses to make a parsing decision based on the current state.
     * @param state the current parsing state
     * @return a {@link Decision} object representing the action to be taken
     */
    abstract makeDecision(state: State): Decision

    /**
     * Abstract method to be implemented by subclasses to score potential decisions based on the current state and transition system.
     * @param state the current parsing state
     * @param transitionSystem the transition system being used (e.g., ARC_STANDARD or ARC_EAGER)
     * @return a list of {@link Decision} objects, each with a score indicating its suitability
     */
    protected abstract scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision>

    /**
     * Finds the best valid parsing action for the ARC_EAGER transition system based on probabilities.
     * Ensures the action is applicable given the current state.
     * @param probabilities a map of actions to their associated probabilities
     * @param state the current parsing state
     * @return the best action as a string, or an empty string if no valid action is found
     */
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

    /**
     * Finds the best valid parsing action for the ARC_STANDARD transition system based on probabilities.
     * Ensures the action is applicable given the current state.
     * @param probabilities a map of actions to their associated probabilities
     * @param state the current parsing state
     * @return the best action as a string, or an empty string if no valid action is found
     */
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

    /**
     * Converts a string representation of the best action into a {@link Candidate} object.
     * @param best the best action represented as a string, possibly with a dependency type in parentheses
     * @return a {@link Candidate} object representing the action, or null if the action is unknown
     */
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