import {
    UniversalDependencyTreeBankSentence
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {
    UniversalDependencyTreeBankCorpus
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankCorpus";
import {DataSet} from "nlptoolkit-classification/dist/DataSet/DataSet";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";
import {Oracle} from "./Oracle";
import {Agenda} from "./Agenda";
import {State} from "./State";
import {StackWord} from "./StackWord";
import {StackRelation} from "./StackRelation";
import {Candidate} from "./Candidate";
import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import {ScoringOracle} from "./ScoringOracle";

export abstract class TransitionParser {

    abstract simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>
    abstract dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence

    protected constructor() {
    }

    protected createResultSentence(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence): UniversalDependencyTreeBankSentence{
        let sentence = new UniversalDependencyTreeBankSentence()
        for (let i = 0; i < universalDependencyTreeBankSentence.wordCount(); i++) {
            let word = universalDependencyTreeBankSentence.getWord(i)
            if (word instanceof UniversalDependencyTreeBankWord){
                sentence.addWord(new UniversalDependencyTreeBankWord(word.getId(), word.getName(), word.getLemma(), word.getUpos(), word.getXpos(), word.getFeatures(), null, word.getDeps(), word.getMisc()))
            }
        }
        return sentence;
    }

    public simulateParseOnCorpus(corpus: UniversalDependencyTreeBankCorpus, windowSize: number): DataSet{
        let dataSet = new DataSet()
        for (let i = 0; i < corpus.sentenceCount(); i++) {
            let sentence = corpus.getSentence(i)
            if (sentence instanceof UniversalDependencyTreeBankSentence){
                dataSet.addInstanceList(this.simulateParse(sentence, windowSize))
            }
        }
        return dataSet;
    }

    private checkStates(agenda: Agenda): boolean{
        for (let state of agenda.getKeySet()){
            if (state.wordListSize() > 0 || state.stackSize() > 1){
                return true
            }
        }
        return false
    }

    protected initialState(sentence: UniversalDependencyTreeBankSentence): State{
        let wordList = new Array<StackWord>();
        for (let i = 0; i < sentence.wordCount(); i++) {
            let word = sentence.getWord(i)
            if (word instanceof UniversalDependencyTreeBankWord){
                wordList.push(new StackWord(word, i + 1))
            }
        }
        let stack = new Array<StackWord>()
        stack.push(new StackWord())
        return new State(stack, wordList, new Array<StackRelation>())
    }

    private constructCandidates(transitionSystem: TransitionSystem, state: State): Array<Candidate>{
        if (state.stackSize() == 1 && state.wordListSize() == 0) {
            return new Array<Candidate>()
        }
        let subsets = new Array<Candidate>()
        if (state.wordListSize() > 0) {
            subsets.push(new Candidate(Command.SHIFT, UniversalDependencyType.DEP))
        }
        if (transitionSystem == TransitionSystem.ARC_EAGER && state.stackSize() > 0) {
            subsets.push(new Candidate(Command.REDUCE, UniversalDependencyType.DEP))
        }
        for (let i = 0; i < UniversalDependencyRelation.universalDependencyTypes.length; i++) {
            let type = UniversalDependencyRelation.getDependencyTag(UniversalDependencyRelation.universalDependencyTypes[i])
            if (transitionSystem == TransitionSystem.ARC_STANDARD && state.stackSize() > 1) {
                subsets.push(new Candidate(Command.LEFTARC, type))
                subsets.push(new Candidate(Command.RIGHTARC, type))
            } else if (transitionSystem == TransitionSystem.ARC_EAGER && state.stackSize() > 0 && state.wordListSize() > 0) {
                subsets.push(new Candidate(Command.LEFTARC, type))
                subsets.push(new Candidate(Command.RIGHTARC, type))
            }
        }
        return subsets
    }

    public dependencyParseWithBeamSearch(oracle: ScoringOracle,
                                         beamSize: number,
                                         universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence,
                                         transitionSystem: TransitionSystem): State{
        let sentence = this.createResultSentence(universalDependencyTreeBankSentence)
        let initialState = this.initialState(sentence)
        let agenda = new Agenda(beamSize)
        agenda.updateAgenda(oracle, initialState.clone())
        while (this.checkStates(agenda)) {
            for (let state of agenda.getKeySet()) {
                let subsets = this.constructCandidates(transitionSystem, state)
                for (let subset of subsets) {
                    let command = subset.getCommand()
                    let type = subset.getUniversalDependencyType()
                    let cloneState = state.clone()
                    cloneState.apply(command, type, transitionSystem)
                    agenda.updateAgenda(oracle, cloneState.clone())
                }
            }
        }
        return agenda.best()
    }

    public dependencyParseCorpus(universalDependencyTreeBankCorpus: UniversalDependencyTreeBankCorpus,
                                 oracle: Oracle){
        let corpus = new UniversalDependencyTreeBankCorpus()
        for (let i = 0; i < universalDependencyTreeBankCorpus.sentenceCount(); i++) {
            let sentence = universalDependencyTreeBankCorpus.getSentence(i)
            if (sentence instanceof UniversalDependencyTreeBankSentence){
                corpus.addSentence(this.dependencyParse(sentence, oracle))
            }
        }
        return corpus
    }
}