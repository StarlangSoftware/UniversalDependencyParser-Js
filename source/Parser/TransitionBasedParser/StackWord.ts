import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";

export class StackWord {

    private word: UniversalDependencyTreeBankWord
    private toWord: number

    constructor1() {
        this.word = new UniversalDependencyTreeBankWord()
    }

    constructor2(word: UniversalDependencyTreeBankWord, toWord: number){
        this.word = word
        this.toWord = toWord
    }

    clone(): StackWord{
        return new StackWord(this.word.clone(), this.toWord)
    }

    constructor(word?: UniversalDependencyTreeBankWord, toWord?: number) {
        if (word == undefined){
            this.constructor1()
        } else {
            this.constructor2(word, toWord)
        }
    }

    getWord(): UniversalDependencyTreeBankWord{
        return this.word
    }

    getToWord(): number{
        return this.toWord
    }
}