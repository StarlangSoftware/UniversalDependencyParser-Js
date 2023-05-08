(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TransitionParser", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord", "./ArcEagerInstanceGenerator", "./StackWord", "./State"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArcEagerTransitionParser = void 0;
    const TransitionParser_1 = require("./TransitionParser");
    const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
    const ArcEagerInstanceGenerator_1 = require("./ArcEagerInstanceGenerator");
    const StackWord_1 = require("./StackWord");
    const State_1 = require("./State");
    class ArcEagerTransitionParser extends TransitionParser_1.TransitionParser {
        constructor() {
            super();
        }
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
                        state.applyArcEagerLeftArc(decision.getUniversalDependencyType());
                        break;
                    case Command.RIGHTARC:
                        state.applyArcEagerRightArc(decision.getUniversalDependencyType());
                        break;
                    case Command.REDUCE:
                        state.applyReduce();
                        break;
                    default:
                        break;
                }
            }
            return sentence;
        }
        simulateParse(sentence, windowSize) {
            let topRelation = null;
            let instanceGenerator = new ArcEagerInstanceGenerator_1.ArcEagerInstanceGenerator();
            let instanceList = new Array();
            let wordMap = new Map();
            let wordList = new Array();
            let stack = new Array();
            for (let j = 0; j < sentence.wordCount(); j++) {
                let word = sentence.getWord(j);
                if (word instanceof UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord) {
                    let clone = word.clone();
                    clone.setRelation(null);
                    wordMap.set(j + 1, word);
                    wordList.push(new StackWord_1.StackWord(clone, j + 1));
                }
            }
            stack.push(new StackWord_1.StackWord());
            let state = new State_1.State(stack, wordList, new Array());
            while (wordList.length > 0 || stack.length > 1) {
                let firstRelation;
                let first;
                if (wordList.length != 0) {
                    first = wordList[0].getWord();
                    firstRelation = wordMap.get(wordList[0].getToWord()).getRelation();
                }
                else {
                    first = null;
                    firstRelation = null;
                }
                let top = stack[stack.length - 1].getWord();
                if (top.getName() != "root") {
                    topRelation = wordMap.get(stack[stack.length - 1].getToWord()).getRelation();
                }
                if (stack.length > 1) {
                    if (firstRelation != null && firstRelation.to() == top.getId()) {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "RIGHTARC(" + firstRelation + ")"));
                        let word = wordList.splice(0, 1)[0];
                        stack.push(new StackWord_1.StackWord(wordMap.get(word.getToWord()), word.getToWord()));
                    }
                    else if (first != null && topRelation != null && topRelation.to() == first.getId()) {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "LEFTARC(" + topRelation + ")"));
                        stack.pop();
                    }
                    else if (wordList.length > 0) {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
                        stack.push(wordList.splice(0, 1)[0]);
                    }
                    else {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "REDUCE"));
                        stack.pop();
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
            return instanceList;
        }
    }
    exports.ArcEagerTransitionParser = ArcEagerTransitionParser;
});
//# sourceMappingURL=ArcEagerTransitionParser.js.map