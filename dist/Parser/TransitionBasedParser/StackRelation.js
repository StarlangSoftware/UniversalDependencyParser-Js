"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackRelation = void 0;
class StackRelation {
    word;
    relation;
    constructor(word, relation) {
        this.word = word;
        this.relation = relation;
    }
    clone() {
        return new StackRelation(this.word.clone(), this.relation);
    }
    getWord() {
        return this.word;
    }
    getRelation() {
        return this.relation;
    }
}
exports.StackRelation = StackRelation;
//# sourceMappingURL=StackRelation.js.map