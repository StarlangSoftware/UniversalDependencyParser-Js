import {UniversalDependencyType} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import {Candidate} from "./Candidate";

export class Decision extends Candidate{

    private readonly point: number

    constructor(command: Command, universalDependencyType: UniversalDependencyType, point: number) {
        super(command, universalDependencyType);
        this.point = point
    }

    getPoint(): number{
        return this.point
    }
}