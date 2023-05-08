import {TransitionParser} from "./TransitionParser";
import {
    UniversalDependencyTreeBankSentence
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import {Oracle} from "./Oracle";
import {Instance} from "nlptoolkit-classification/dist/Instance/Instance";
import {StackWord} from "./StackWord";
import {SimpleInstanceGenerator} from "./SimpleInstanceGenerator";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {State} from "./State";
import {StackRelation} from "./StackRelation";

export class ArcStandardTransitionParser extends TransitionParser{

    constructor() {
        super()
    }

    private checkForMoreRelation(wordList: Array<StackWord>, id: number){
        for (let word of wordList) {
            if (word.getWord().getRelation().to() == id) {
                return false;
            }
        }
        return true
    }

    dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence {
        let sentence = this.createResultSentence(universalDependencyTreeBankSentence)
        let state = this.initialState(sentence)
        while (state.wordListSize() > 0 || state.stackSize() > 1) {
            let decision = oracle.makeDecision(state)
            switch (decision.getCommand()) {
                case Command.SHIFT:
                    state.applyShift()
                    break
                case Command.LEFTARC:
                    state.applyLeftArc(decision.getUniversalDependencyType())
                    break
                case Command.RIGHTARC:
                    state.applyRightArc(decision.getUniversalDependencyType())
                    break
                default:
                    break
            }
        }
        return sentence;
    }

    simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance> {
        let instanceGenerator = new SimpleInstanceGenerator()
        let instanceList = new Array<Instance>()
        let wordList = new Array<StackWord>()
        let stack = new Array<StackWord>()
        for (let j = 0; j < sentence.wordCount(); j++) {
            let word = sentence.getWord(j)
            if (word instanceof UniversalDependencyTreeBankWord){
                wordList.push(new StackWord(word, j + 1))
            }
        }
        stack.push(new StackWord());
        let state = new State(stack, wordList, new Array<StackRelation>())
        if (wordList.length > 0) {
            instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"));
            stack.push(wordList.splice(0, 1)[0])
            if (wordList.length > 1) {
                instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"))
                stack.push(wordList.splice(0, 1)[0])
            }
            while (wordList.length > 0 || stack.length > 1) {
                let top = stack[stack.length - 1].getWord()
                let topRelation = top.getRelation()
                if (stack.length > 1) {
                    let beforeTop = stack[stack.length - 2].getWord();
                    let beforeTopRelation = beforeTop.getRelation()
                    if (beforeTop.getId() == topRelation.to() && this.checkForMoreRelation(wordList, top.getId())) {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "RIGHTARC(" + topRelation + ")"))
                        stack.pop();
                    } else if (top.getId() == beforeTopRelation.to()) {
                        instanceList.push(instanceGenerator.generate(state, windowSize, "LEFTARC(" + beforeTopRelation + ")"))
                        stack.splice(stack.length - 2, 1)
                    } else {
                        if (wordList.length > 0) {
                            instanceList.push(instanceGenerator.generate(state, windowSize, "SHIFT"))
                            stack.push(wordList.splice(0, 1)[0])
                        } else {
                            break
                        }
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
        }
        return instanceList
    }

}