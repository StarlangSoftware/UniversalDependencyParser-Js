import {State} from "./State";

export abstract class ScoringOracle {
    abstract score(state: State): number
}
