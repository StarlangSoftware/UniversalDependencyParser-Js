(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./StackWord", "./StackRelation", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    const StackWord_1 = require("./StackWord");
    const StackRelation_1 = require("./StackRelation");
    const UniversalDependencyRelation_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation");
    const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
    class State {
        constructor(stack, wordList, relations) {
            this.stack = stack;
            this.wordList = wordList;
            this.relations = relations;
        }
        applyShift() {
            if (this.wordList.length > 0) {
                this.stack.push(this.wordList.splice(0, 1)[0]);
            }
        }
        applyLeftArc(type) {
            if (this.stack.length > 1) {
                let beforeLast = this.stack[this.stack.length - 2].getWord();
                let index = this.stack[this.stack.length - 1].getToWord();
                beforeLast.setRelation(new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":")));
                this.stack.splice(this.stack.length - 2, 1);
                this.relations.push(new StackRelation_1.StackRelation(beforeLast, new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":"))));
            }
        }
        applyRightArc(type) {
            if (this.stack.length > 1) {
                let last = this.stack[this.stack.length - 1].getWord();
                let index = this.stack[this.stack.length - 2].getToWord();
                last.setRelation(new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":")));
                this.stack.pop();
                this.relations.push(new StackRelation_1.StackRelation(last, new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":"))));
            }
        }
        applyArcEagerLeftArc(type) {
            if (this.stack.length > 0 && this.wordList.length > 0) {
                let lastElementOfStack = this.stack[this.stack.length - 1].getWord();
                let index = this.wordList[0].getToWord();
                lastElementOfStack.setRelation(new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":")));
                this.stack.pop();
                this.relations.push(new StackRelation_1.StackRelation(lastElementOfStack, new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":"))));
            }
        }
        applyArcEagerRightArc(type) {
            if (this.stack.length > 0 && this.wordList.length > 0) {
                let firstElementOfWordList = this.wordList[0].getWord();
                let index = this.stack[this.stack.length - 1].getToWord();
                firstElementOfWordList.setRelation(new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":")));
                this.applyShift();
                this.relations.push(new StackRelation_1.StackRelation(firstElementOfWordList, new UniversalDependencyRelation_1.UniversalDependencyRelation(index, type.toString().replace("_", ":"))));
            }
        }
        applyReduce() {
            if (this.stack.length > 0) {
                this.stack.pop();
            }
        }
        apply(command, type, transitionSystem) {
            switch (transitionSystem) {
                case TransitionSystem.ARC_STANDARD:
                    switch (command) {
                        case Command.LEFTARC:
                            this.applyLeftArc(type);
                            break;
                        case Command.RIGHTARC:
                            this.applyRightArc(type);
                            break;
                        case Command.SHIFT:
                            this.applyShift();
                            break;
                    }
                    break;
                case TransitionSystem.ARC_EAGER:
                    switch (command) {
                        case Command.LEFTARC:
                            this.applyArcEagerLeftArc(type);
                            break;
                        case Command.RIGHTARC:
                            this.applyArcEagerRightArc(type);
                            break;
                        case Command.SHIFT:
                            this.applyShift();
                            break;
                        case Command.REDUCE:
                            this.applyReduce();
                            break;
                    }
            }
        }
        relationSize() {
            return this.relations.length;
        }
        wordListSize() {
            return this.wordList.length;
        }
        stackSize() {
            return this.stack.length;
        }
        getStackWord(index) {
            let size = this.stack.length - 1;
            if (size - index < 0) {
                return null;
            }
            return this.stack[size - index].getWord();
        }
        getPeek() {
            if (this.stack.length > 0) {
                return this.stack[this.stack.length - 1].getWord();
            }
            return null;
        }
        getWordListWord(index) {
            if (index > this.wordList.length - 1) {
                return null;
            }
            return this.wordList[index].getWord();
        }
        getRelation(index) {
            if (index < this.relations.length) {
                return this.relations[index];
            }
            return null;
        }
        clone() {
            let o = new State(new Array(), new Array(), new Array());
            for (let element of this.stack) {
                if (element.getWord().getName() != "root") {
                    o.stack.push(element.clone());
                }
                else {
                    o.stack.push(new StackWord_1.StackWord(new UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord(), element.getToWord()));
                }
            }
            for (let word of this.wordList) {
                o.wordList.push(word.clone());
            }
            for (let relation of this.relations) {
                if (relation.getWord().getName() != "root") {
                    o.relations.push(relation.clone());
                }
                else {
                    o.relations.push(new StackRelation_1.StackRelation(new UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord(), relation.getRelation()));
                }
            }
            return o;
        }
    }
    exports.State = State;
});
//# sourceMappingURL=State.js.map