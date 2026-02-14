import { Oracle } from "./Oracle";
import { State } from "./State";
import { Decision } from "./Decision";
import { Model } from "nlptoolkit-classification/dist/Model/Model";
import { TransitionSystem } from "./TransitionSystem";
export declare class RandomOracle extends Oracle {
    constructor(model: Model, windowSize: number);
    /**
     * Makes a random decision based on a uniform distribution over possible actions.
     * @param state The current state of the parser.
     * @return A Decision object representing the randomly chosen action.
     */
    makeDecision(state: State): Decision;
    protected scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision>;
}
