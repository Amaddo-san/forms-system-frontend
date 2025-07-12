import { User } from "./User";
import { WorkflowResource } from "./WorkflowResource";

export class ActivityForm extends WorkflowResource {
    id?: number;
    student!: User;
    supervisor!: User;
    activityType!: string;
    activityDate!: string; // LocalDate as string
    organizingEntity!: string;
    requiredServices!: string[];
    location!: string;
    startTime!: string; // LocalDateTime
    endTime!: string;   // LocalDateTime
    phoneNumber!: string;
    description!: string;
    rejectionReason?: string;
    createdAt?: string;

    constructor(init?: Partial<ActivityForm>) {
        super();
        Object.assign(this, init);
    }
}
