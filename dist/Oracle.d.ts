import { Model } from "nlptoolkit-classification/dist/Model/Model";
import { Decision } from "./Decision";
import { State } from "./State";
import { Candidate } from "./Candidate";
export declare abstract class Oracle {
    protected commandModel: Model;
    protected windowSize: number;
    protected constructor(model: Model, windowSize: number);
    abstract makeDecision(state: State): Decision;
    protected abstract scoreDecisions(state: State, transitionSystem: TransitionSystem): Array<Decision>;
    protected findBestValidEagerClassInfo(probabilities: Map<string, number>, state: State): string;
    protected findBestValidStandardClassInfo(probabilities: Map<string, number>, state: State): string;
    protected getDecisionCandidate(best: string): Candidate;
}
