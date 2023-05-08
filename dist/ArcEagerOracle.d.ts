import { Oracle } from "./Oracle";
import { State } from "./State";
import { Decision } from "./Decision";
import { Model } from "nlptoolkit-classification/dist/Model/Model";
export declare class ArcEagerOracle extends Oracle {
    constructor(model: Model, windowSize: number);
    makeDecision(state: State): Decision;
    protected scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision>;
}
