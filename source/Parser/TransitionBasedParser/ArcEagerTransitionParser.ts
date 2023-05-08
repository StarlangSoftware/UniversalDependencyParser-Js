import {TransitionParser} from "./TransitionParser";
import {
    UniversalDependencyTreeBankSentence
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";
import {Oracle} from "./Oracle";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {ArcEagerInstanceGenerator} from "./ArcEagerInstanceGenerator";
import {StackWord} from "./StackWord";
import {State} from "./State";
import {StackRelation} from "./StackRelation";

export class ArcEagerTransitionParser extends TransitionParser{

    constructor() {
        super()
    }

    dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence {
        let sentence = this.createResultSentence(universalDependencyTreeBankSentence)
        let state = this.initialState(sentence)
        while (state.wordListSize() > 0 || state.stackSize() > 1) {
            let decision = oracle.makeDecision(state)
            switch (decision.getCommand()) {
                case Command.SHIFT:
                    state.applyShift()
                    break;
                case Command.LEFTARC:
                    state.applyArcEagerLeftArc(decision.getUniversalDependencyType())
                    break;
                case Command.RIGHTARC:
                    state.applyArcEagerRightArc(decision.getUniversalDependencyType())
                    break;
                case Command.REDUCE:
                    state.applyReduce()
                    break;
                default:
                    break;
            }
        }
        return sentence;
    }

    simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance> {
        let topRelation = null
        let instanceGenerator = new ArcEagerInstanceGenerator()
        let instanceList = new Array<Instance>()
        let wordMap = new Map<number, UniversalDependencyTreeBankWord>()
        let wordList = new Array<StackWord>()
        let stack = new Array<StackWord>()
        for (let j = 0; j < sentence.wordCount(); j++) {
            let word = sentence.getWord(j);
            if (word instanceof UniversalDependencyTreeBankWord){
                let clone = word.clone()
                clone.setRelation(null)
                wordMap.set(j + 1, word)
                wordList.push(new StackWord(clone, j + 1));
            }
        }
        stack.push(new StackWord())
        let state = new State(stack, wordList, new Array<StackRelation>())
        while (wordList.length > 0 || stack.length > 1) {
            let firstRelation
            let first
            if (wordList.length != 0) {
                first = wordList[0].getWord()
                firstRelation = wordMap.get(wordList[0].getToWord()).getRelation()
            } else {
                first = null
                firstRelation = null
            }
            let top = stack[stack.length - 1].getWord()
            if (top.getName() != "root") {
                topRelation = wordMap.get(stack[stack.length - 1].getToWord()).getRelation()
            }
            if (stack.length > 1) {
                if (firstRelation != null && firstRelation.to() == top.getId()) {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "RIGHTARC(" + firstRelation + ")"))
                    let word = wordList.splice(0, 1)[0]
                    stack.push(new StackWord(wordMap.get(word.getToWord()), word.getToWord()));
                } else if (first != null && topRelation != null && topRelation.to() == first.getId()) {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "LEFTARC(" + topRelation + ")"))
                    stack.pop()
                } else if (wordList.length > 0) {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"))
                    stack.push(wordList.splice(0, 1)[0])
                } else {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "REDUCE"))
                    stack.pop()
                }
            } else {
                if (wordList.length > 0) {
                    instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"))
                    stack.push(wordList.splice(0, 1)[0])
                } else {
                    break
                }
            }
        }
        return instanceList
    }

}