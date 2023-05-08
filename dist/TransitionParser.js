(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankCorpus", "nlptoolkit-classification/dist/DataSet/DataSet", "./Agenda", "./State", "./StackWord", "./Candidate", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation"], factory);
    }
})(function (require, exports) {
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
    class TransitionParser {
        constructor() {
        }
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
        checkStates(agenda) {
            for (let state of agenda.getKeySet()) {
                if (state.wordListSize() > 0 || state.stackSize() > 1) {
                    return true;
                }
            }
            return false;
        }
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
        constructCandidates(transitionSystem, state) {
            if (state.stackSize() == 1 && state.wordListSize() == 0) {
                return new Array();
            }
            let subsets = new Array();
            if (state.wordListSize() > 0) {
                subsets.push(new Candidate_1.Candidate(Command.SHIFT, UniversalDependencyType_1.UniversalDependencyType.DEP));
            }
            if (transitionSystem == TransitionSystem.ARC_EAGER && state.stackSize() > 0) {
                subsets.push(new Candidate_1.Candidate(Command.REDUCE, UniversalDependencyType_1.UniversalDependencyType.DEP));
            }
            for (let i = 0; i < UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTypes.length; i++) {
                let type = UniversalDependencyRelation_1.UniversalDependencyRelation.getDependencyTag(UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTypes[i]);
                if (transitionSystem == TransitionSystem.ARC_STANDARD && state.stackSize() > 1) {
                    subsets.push(new Candidate_1.Candidate(Command.LEFTARC, type));
                    subsets.push(new Candidate_1.Candidate(Command.RIGHTARC, type));
                }
                else if (transitionSystem == TransitionSystem.ARC_EAGER && state.stackSize() > 0 && state.wordListSize() > 0) {
                    subsets.push(new Candidate_1.Candidate(Command.LEFTARC, type));
                    subsets.push(new Candidate_1.Candidate(Command.RIGHTARC, type));
                }
            }
            return subsets;
        }
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
});
//# sourceMappingURL=TransitionParser.js.map