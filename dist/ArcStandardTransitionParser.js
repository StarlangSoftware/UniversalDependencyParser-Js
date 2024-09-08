(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TransitionParser", "./StackWord", "./SimpleInstanceGenerator", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord", "./State"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArcStandardTransitionParser = void 0;
    const TransitionParser_1 = require("./TransitionParser");
    const StackWord_1 = require("./StackWord");
    const SimpleInstanceGenerator_1 = require("./SimpleInstanceGenerator");
    const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
    const State_1 = require("./State");
    class ArcStandardTransitionParser extends TransitionParser_1.TransitionParser {
        constructor() {
            super();
        }
        /**
         * Checks if there are more relations with a specified ID in the list of words.
         * @param wordList The list of words to check.
         * @param id The ID to check for.
         * @return True if no more relations with the specified ID are found; false otherwise.
         */
        checkForMoreRelation(wordList, id) {
            for (let word of wordList) {
                if (word.getWord().getRelation().to() == id) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Performs dependency parsing on the given sentence using the provided oracle.
         * @param universalDependencyTreeBankSentence The sentence to be parsed.
         * @param oracle The oracle used to make parsing decisions.
         * @return The parsed sentence with dependency relations established.
         */
        dependencyParse(universalDependencyTreeBankSentence, oracle) {
            let sentence = this.createResultSentence(universalDependencyTreeBankSentence);
            let state = this.initialState(sentence);
            while (state.wordListSize() > 0 || state.stackSize() > 1) {
                let decision = oracle.makeDecision(state);
                switch (decision.getCommand()) {
                    case Command.SHIFT:
                        state.applyShift();
                        break;
                    case Command.LEFTARC:
                        state.applyLeftArc(decision.getUniversalDependencyType());
                        break;
                    case Command.RIGHTARC:
                        state.applyRightArc(decision.getUniversalDependencyType());
                        break;
                    default:
                        break;
                }
            }
            return sentence;
        }
        /**
         * Simulates the parsing process for a given sentence using the Arc Standard parsing algorithm.
         * @param sentence The sentence to be parsed.
         * @param windowSize The size of the window used for feature generation.
         * @return An ArrayList of {@link Instance} objects representing the parsed actions.
         */
        simulateParse(sentence, windowSize) {
            let instanceGenerator = new SimpleInstanceGenerator_1.SimpleInstanceGenerator();
            let instanceList = new Array();
            let wordList = new Array();
            let stack = new Array();
            for (let j = 0; j < sentence.wordCount(); j++) {
                let word = sentence.getWord(j);
                if (word instanceof UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord) {
                    wordList.push(new StackWord_1.StackWord(word, j + 1));
                }
            }
            stack.push(new StackWord_1.StackWord());
            let state = new State_1.State(stack, wordList, new Array());
            if (wordList.length > 0) {
                instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
                stack.push(wordList.splice(0, 1)[0]);
                if (wordList.length > 1) {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
                    stack.push(wordList.splice(0, 1)[0]);
                }
                while (wordList.length > 0 || stack.length > 1) {
                    let top = stack[stack.length - 1].getWord();
                    let topRelation = top.getRelation();
                    if (stack.length > 1) {
                        let beforeTop = stack[stack.length - 2].getWord();
                        let beforeTopRelation = beforeTop.getRelation();
                        if (beforeTop.getId() == topRelation.to() && this.checkForMoreRelation(wordList, top.getId())) {
                            instanceList.push(instanceGenerator.generate(state, windowSize, "RIGHTARC(" + topRelation + ")"));
                            stack.pop();
                        }
                        else if (top.getId() == beforeTopRelation.to()) {
                            instanceList.push(instanceGenerator.generate(state, windowSize, "LEFTARC(" + beforeTopRelation + ")"));
                            stack.splice(stack.length - 2, 1);
                        }
                        else {
                            if (wordList.length > 0) {
                                instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
                                stack.push(wordList.splice(0, 1)[0]);
                            }
                            else {
                                break;
                            }
                        }
                    }
                    else {
                        if (wordList.length > 0) {
                            instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
                            stack.push(wordList.splice(0, 1)[0]);
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            return instanceList;
        }
    }
    exports.ArcStandardTransitionParser = ArcStandardTransitionParser;
});
//# sourceMappingURL=ArcStandardTransitionParser.js.map