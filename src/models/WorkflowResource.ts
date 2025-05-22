import { WorkflowActionResource } from "./WorkflowActionResource";

export class WorkflowResource {
    uuid?: string;
    status?: string;
    availableActions: WorkflowActionResource[] = [];
}
