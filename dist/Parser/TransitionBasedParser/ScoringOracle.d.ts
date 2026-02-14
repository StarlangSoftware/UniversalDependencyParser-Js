import { State } from "./State";
export declare abstract class ScoringOracle {
    abstract score(state: State): number;
}
