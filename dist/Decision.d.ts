import { UniversalDependencyType } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import { Candidate } from "./Candidate";
export declare class Decision extends Candidate {
    private readonly point;
    constructor(command: Command, universalDependencyType: UniversalDependencyType, point: number);
    getPoint(): number;
}
