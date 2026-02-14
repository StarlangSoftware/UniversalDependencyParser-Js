import { ScoringOracle } from "./ScoringOracle";
import { State } from "./State";
export declare class RandomScoringOracle extends ScoringOracle {
    score(state: State): number;
}
