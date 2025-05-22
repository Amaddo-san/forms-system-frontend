import { User } from "./User";
import { WorkflowResource } from "./WorkflowResource";

export class ActivityForm extends WorkflowResource {
    id?: number;
    student!: User;
    supervisorName!: string;
    activityType!: string;
    activityDate!: string; // LocalDate as string
    organizingEntity!: string;
    location!: string;
    startTime!: string; // LocalDateTime
    endTime!: string;   // LocalDateTime
    phoneNumber!: string;
    description!: string;
    createdAt?: string;

    constructor(init?: Partial<ActivityForm>) {
        super();
        Object.assign(this, init);
    }
}
