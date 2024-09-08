import {State} from "./State";
import {ScoringOracle} from "./ScoringOracle";

export class Agenda {

    private agenda: Map<State, number>
    private beamSize: number

    constructor(beamSize: number) {
        this.agenda = new Map<State, number>()
        this.beamSize = beamSize
    }

    /**
     * Retrieves the set of states currently in the agenda.
     * @return A set of states that are currently in the agenda.
     */
    getKeySet(): IterableIterator<State>{
        return this.agenda.keys()
    }

    /**
     * Updates the agenda with a new state if it is better than the worst state
     * currently in the agenda or if there is room in the agenda.
     * @param oracle The ScoringOracle used to score the state.
     * @param current The state to be added to the agenda.
     */
    updateAgenda(oracle: ScoringOracle, current: State){
        if (this.agenda.has(current)){
            return
        }
        let point = oracle.score(current)
        if (this.agenda.size < this.beamSize){
            this.agenda.set(current, point)
        } else{
            let worst = null
            let worstValue = Number.MAX_VALUE
            for (let key of this.agenda.keys()){
                if (this.agenda.get(key) < worstValue){
                    worstValue = this.agenda.get(key)
                    worst = key
                }
            }
            if (point > worstValue){
                this.agenda.delete(worst)
                this.agenda.set(current, point)
            }
        }
    }

    /**
     * Retrieves the best state from the agenda based on the highest score.
     * @return The state with the highest score in the agenda.
     */
    best(): State{
        let best = null
        let bestValue = Number.MIN_VALUE
        for (let key of this.agenda.keys()){
            if (this.agenda.get(key) > bestValue){
                bestValue = this.agenda.get(key)
                best = key
            }
        }
        return best
    }
}