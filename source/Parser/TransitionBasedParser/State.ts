import {StackWord} from "./StackWord";
import {StackRelation} from "./StackRelation";
import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";

export class State {

    private stack: Array<StackWord>
    private wordList: Array<StackWord>
    private relations: Array<StackRelation>

    constructor(stack: Array<StackWord>, wordList: Array<StackWord>, relations: Array<StackRelation>){
        this.stack = stack
        this.wordList = wordList
        this.relations = relations
    }

    public applyShift(){
        if (this.wordList.length > 0){
            this.stack.push(this.wordList.splice(0, 1)[0])
        }
    }

    public applyLeftArc(type: UniversalDependencyType){
        if (this.stack.length > 1){
            let beforeLast = this.stack[this.stack.length - 2].getWord()
            let index = this.stack[this.stack.length - 1].getToWord()
            beforeLast.setRelation(new UniversalDependencyRelation(index, type.toString().replace("_", ":")))
            this.stack.splice(this.stack.length - 2, 1)
            this.relations.push(new StackRelation(beforeLast, new UniversalDependencyRelation(index, type.toString().replace("_", ":"))))
        }
    }

    public applyRightArc(type: UniversalDependencyType){
        if (this.stack.length > 1){
            let last = this.stack[this.stack.length - 1].getWord()
            let index = this.stack[this.stack.length - 2].getToWord()
            last.setRelation(new UniversalDependencyRelation(index, type.toString().replace("_", ":")))
            this.stack.pop()
            this.relations.push(new StackRelation(last, new UniversalDependencyRelation(index, type.toString().replace("_", ":"))))
        }
    }

    public applyArcEagerLeftArc(type: UniversalDependencyType){
        if (this.stack.length > 0 && this.wordList.length > 0){
            let lastElementOfStack = this.stack[this.stack.length - 1].getWord()
            let index = this.wordList[0].getToWord()
            lastElementOfStack.setRelation(new UniversalDependencyRelation(index, type.toString().replace("_", ":")))
            this.stack.pop()
            this.relations.push(new StackRelation(lastElementOfStack, new UniversalDependencyRelation(index, type.toString().replace("_", ":"))))
        }
    }

    public applyArcEagerRightArc(type: UniversalDependencyType){
        if (this.stack.length > 0 && this.wordList.length > 0){
            let firstElementOfWordList = this.wordList[0].getWord()
            let index = this.stack[this.stack.length - 1].getToWord()
            firstElementOfWordList.setRelation(new UniversalDependencyRelation(index, type.toString().replace("_", ":")))
            this.applyShift()
            this.relations.push(new StackRelation(firstElementOfWordList, new UniversalDependencyRelation(index, type.toString().replace("_", ":"))))
        }
    }

    public applyReduce(){
        if (this.stack.length > 0){
            this.stack.pop()
        }
    }

    public apply(command: Command, type: UniversalDependencyType, transitionSystem: TransitionSystem){
        switch (transitionSystem){
            case TransitionSystem.ARC_STANDARD:
                switch (command) {
                    case Command.LEFTARC:
                        this.applyLeftArc(type)
                        break
                    case Command.RIGHTARC:
                        this.applyRightArc(type)
                        break
                    case Command.SHIFT:
                        this.applyShift()
                        break
                }
                break
            case TransitionSystem.ARC_EAGER:
                switch (command){
                    case Command.LEFTARC:
                        this.applyArcEagerLeftArc(type)
                        break
                    case Command.RIGHTARC:
                        this.applyArcEagerRightArc(type)
                        break
                    case Command.SHIFT:
                        this.applyShift()
                        break
                    case Command.REDUCE:
                        this.applyReduce()
                        break
                }
        }
    }

    public relationSize(): number{
        return this.relations.length
    }

    public wordListSize(): number{
        return this.wordList.length
    }

    public stackSize(): number{
        return this.stack.length
    }

    public getStackWord(index: number): UniversalDependencyTreeBankWord{
        let size = this.stack.length - 1
        if (size - index < 0){
            return null
        }
        return this.stack[size - index].getWord()
    }

    public getPeek(): UniversalDependencyTreeBankWord{
        if (this.stack.length > 0){
            return this.stack[this.stack.length - 1].getWord()
        }
        return null
    }

    public getWordListWord(index: number): UniversalDependencyTreeBankWord{
        if (index > this.wordList.length - 1){
            return null
        }
        return this.wordList[index].getWord()
    }

    public getRelation(index: number): StackRelation{
        if (index < this.relations.length){
            return this.relations[index]
        }
        return null
    }

    public clone(): State{
        let o = new State(new Array<StackWord>(), new Array<StackWord>(), new Array<StackRelation>())
        for (let element of this.stack){
            if (element.getWord().getName() != "root"){
                o.stack.push(element.clone())
            } else {
                o.stack.push(new StackWord(new UniversalDependencyTreeBankWord(), element.getToWord()))
            }
        }
        for (let word of this.wordList){
            o.wordList.push(word.clone())
        }
        for (let relation of this.relations){
            if (relation.getWord().getName() != "root"){
                o.relations.push(relation.clone())
            } else {
                o.relations.push(new StackRelation(new UniversalDependencyTreeBankWord(), relation.getRelation()))
            }
        }
        return o
    }
}