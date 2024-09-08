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

    /**
     * Parses a single sentence and returns a list of instances that represent the parsing process.
     * @param sentence the sentence to be parsed
     * @param windowSize the size of the window used in parsing
     * @return a list of {@link Instance} objects representing the parsing process
     */
    abstract simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>

    /**
     * Parses a single sentence using a specified oracle and returns the parsed sentence with dependencies.
     * @param universalDependencyTreeBankSentence the sentence to be parsed
     * @param oracle the oracle used for guiding the parsing process
     * @return a {@link UniversalDependencyTreeBankSentence} with dependencies parsed
     */
    abstract dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence

    protected constructor() {
    }

    /**
     * Creates a new {@link UniversalDependencyTreeBankSentence} with the same words as the input sentence,
     * but with null heads, effectively cloning the sentence structure without dependencies.
     * @param universalDependencyTreeBankSentence the sentence to be cloned
     * @return a new {@link UniversalDependencyTreeBankSentence} with copied words but no dependencies
     */
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

    /**
     * Simulates parsing a corpus of sentences, returning a dataset of instances created by parsing each sentence.
     * @param corpus the corpus to be parsed
     * @param windowSize the size of the window used in parsing
     * @return a {@link DataSet} containing instances from parsing each sentence in the corpus
     */
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

    /**
     * Checks if there are any states in the agenda that still have words to process or have more than one item in the stack.
     * @param agenda the agenda containing the states
     * @return true if there are states to process, false otherwise
     */
    private checkStates(agenda: Agenda): boolean{
        for (let state of agenda.getKeySet()){
            if (state.wordListSize() > 0 || state.stackSize() > 1){
                return true
            }
        }
        return false
    }

    /**
     * Initializes the parsing state with a stack containing one empty {@link StackWord} and a word list containing all words in the sentence.
     * @param sentence the sentence to initialize the state with
     * @return a {@link State} representing the starting point for parsing
     */
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

    /**
     * Constructs possible parsing candidates based on the current state and transition system.
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @param state the current parsing state
     * @return a list of possible {@link Candidate} actions to be applied
     */
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

    /**
     * Performs dependency parsing with beam search to find the best parse for a given sentence.
     * @param oracle the scoring oracle used for guiding the search
     * @param beamSize the size of the beam for beam search
     * @param universalDependencyTreeBankSentence the sentence to be parsed
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @return the best parsing state from the beam search
     */
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

    /**
     * Parses a corpus of sentences using the given oracle and returns a new corpus with the parsed sentences.
     * @param universalDependencyTreeBankCorpus the corpus to be parsed
     * @param oracle the oracle used for guiding the parsing process
     * @return a {@link UniversalDependencyTreeBankCorpus} containing the parsed sentences
     */
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