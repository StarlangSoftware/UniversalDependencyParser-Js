"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionParser = void 0;
const UniversalDependencyTreeBankSentence_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence");
const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
const UniversalDependencyTreeBankCorpus_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankCorpus");
const DataSet_1 = require("nlptoolkit-classification/dist/DataSet/DataSet");
const Agenda_1 = require("./Agenda");
const State_1 = require("./State");
const StackWord_1 = require("./StackWord");
const Candidate_1 = require("./Candidate");
const UniversalDependencyType_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType");
const UniversalDependencyRelation_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation");
const Command_1 = require("./Command");
const TransitionSystem_1 = require("./TransitionSystem");
class TransitionParser {
    constructor() {
    }
    /**
     * Creates a new {@link UniversalDependencyTreeBankSentence} with the same words as the input sentence,
     * but with null heads, effectively cloning the sentence structure without dependencies.
     * @param universalDependencyTreeBankSentence the sentence to be cloned
     * @return a new {@link UniversalDependencyTreeBankSentence} with copied words but no dependencies
     */
    createResultSentence(universalDependencyTreeBankSentence) {
        let sentence = new UniversalDependencyTreeBankSentence_1.UniversalDependencyTreeBankSentence();
        for (let i = 0; i < universalDependencyTreeBankSentence.wordCount(); i++) {
            let word = universalDependencyTreeBankSentence.getWord(i);
            if (word instanceof UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord) {
                sentence.addWord(new UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord(word.getId(), word.getName(), word.getLemma(), word.getUpos(), word.getXpos(), word.getFeatures(), null, word.getDeps(), word.getMisc()));
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
    simulateParseOnCorpus(corpus, windowSize) {
        let dataSet = new DataSet_1.DataSet();
        for (let i = 0; i < corpus.sentenceCount(); i++) {
            let sentence = corpus.getSentence(i);
            if (sentence instanceof UniversalDependencyTreeBankSentence_1.UniversalDependencyTreeBankSentence) {
                dataSet.addInstanceList(this.simulateParse(sentence, windowSize));
            }
        }
        return dataSet;
    }
    /**
     * Checks if there are any states in the agenda that still have words to process or have more than one item in the stack.
     * @param agenda the agenda containing the states
     * @return true if there are states to process, false otherwise
     */
    checkStates(agenda) {
        for (let state of agenda.getKeySet()) {
            if (state.wordListSize() > 0 || state.stackSize() > 1) {
                return true;
            }
        }
        return false;
    }
    /**
     * Initializes the parsing state with a stack containing one empty {@link StackWord} and a word list containing all words in the sentence.
     * @param sentence the sentence to initialize the state with
     * @return a {@link State} representing the starting point for parsing
     */
    initialState(sentence) {
        let wordList = new Array();
        for (let i = 0; i < sentence.wordCount(); i++) {
            let word = sentence.getWord(i);
            if (word instanceof UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord) {
                wordList.push(new StackWord_1.StackWord(word, i + 1));
            }
        }
        let stack = new Array();
        stack.push(new StackWord_1.StackWord());
        return new State_1.State(stack, wordList, new Array());
    }
    /**
     * Constructs possible parsing candidates based on the current state and transition system.
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @param state the current parsing state
     * @return a list of possible {@link Candidate} actions to be applied
     */
    constructCandidates(transitionSystem, state) {
        if (state.stackSize() == 1 && state.wordListSize() == 0) {
            return new Array();
        }
        let subsets = new Array();
        if (state.wordListSize() > 0) {
            subsets.push(new Candidate_1.Candidate(Command_1.Command.SHIFT, UniversalDependencyType_1.UniversalDependencyType.DEP));
        }
        if (transitionSystem == TransitionSystem_1.TransitionSystem.ARC_EAGER && state.stackSize() > 0) {
            subsets.push(new Candidate_1.Candidate(Command_1.Command.REDUCE, UniversalDependencyType_1.UniversalDependencyType.DEP));
        }
        for (let i = 0; i < UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTypes.length; i++) {
            let type = UniversalDependencyRelation_1.UniversalDependencyRelation.getDependencyTag(UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTypes[i]);
            if (transitionSystem == TransitionSystem_1.TransitionSystem.ARC_STANDARD && state.stackSize() > 1) {
                subsets.push(new Candidate_1.Candidate(Command_1.Command.LEFTARC, type));
                subsets.push(new Candidate_1.Candidate(Command_1.Command.RIGHTARC, type));
            }
            else if (transitionSystem == TransitionSystem_1.TransitionSystem.ARC_EAGER && state.stackSize() > 0 && state.wordListSize() > 0) {
                subsets.push(new Candidate_1.Candidate(Command_1.Command.LEFTARC, type));
                subsets.push(new Candidate_1.Candidate(Command_1.Command.RIGHTARC, type));
            }
        }
        return subsets;
    }
    /**
     * Performs dependency parsing with beam search to find the best parse for a given sentence.
     * @param oracle the scoring oracle used for guiding the search
     * @param beamSize the size of the beam for beam search
     * @param universalDependencyTreeBankSentence the sentence to be parsed
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @return the best parsing state from the beam search
     */
    dependencyParseWithBeamSearch(oracle, beamSize, universalDependencyTreeBankSentence, transitionSystem) {
        let sentence = this.createResultSentence(universalDependencyTreeBankSentence);
        let initialState = this.initialState(sentence);
        let agenda = new Agenda_1.Agenda(beamSize);
        agenda.updateAgenda(oracle, initialState.clone());
        while (this.checkStates(agenda)) {
            for (let state of agenda.getKeySet()) {
                let subsets = this.constructCandidates(transitionSystem, state);
                for (let subset of subsets) {
                    let command = subset.getCommand();
                    let type = subset.getUniversalDependencyType();
                    let cloneState = state.clone();
                    cloneState.apply(command, type, transitionSystem);
                    agenda.updateAgenda(oracle, cloneState.clone());
                }
            }
        }
        return agenda.best();
    }
    /**
     * Parses a corpus of sentences using the given oracle and returns a new corpus with the parsed sentences.
     * @param universalDependencyTreeBankCorpus the corpus to be parsed
     * @param oracle the oracle used for guiding the parsing process
     * @return a {@link UniversalDependencyTreeBankCorpus} containing the parsed sentences
     */
    dependencyParseCorpus(universalDependencyTreeBankCorpus, oracle) {
        let corpus = new UniversalDependencyTreeBankCorpus_1.UniversalDependencyTreeBankCorpus();
        for (let i = 0; i < universalDependencyTreeBankCorpus.sentenceCount(); i++) {
            let sentence = universalDependencyTreeBankCorpus.getSentence(i);
            if (sentence instanceof UniversalDependencyTreeBankSentence_1.UniversalDependencyTreeBankSentence) {
                corpus.addSentence(this.dependencyParse(sentence, oracle));
            }
        }
        return corpus;
    }
}
exports.TransitionParser = TransitionParser;
//# sourceMappingURL=TransitionParser.js.map