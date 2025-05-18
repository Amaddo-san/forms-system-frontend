import { User } from "./User";


export class ActivityForm {
    id?: string;
    uuid?: string;
    status: string;
    student: User;
    supervisorName: String;
    activityType: string;
    activityDate: string;
    organizingEntity: string;
    location: string;
    startTime: string;
    endTime: string;
    phoneNumber: string;
    description: string;
    workflowAction?: string;


    constructor(
        status: string,
        student: User,
        supervisorName: String,
        activityType: string,
        activityDate: string,
        organizingEntity: string,
        location: string,
        startTime: string,
        endTime: string,
        phoneNumber: string,
        description: string,
        id?: string
    ) {
        this.id = id;
        this.student = student;
        this.status = status;
        this.supervisorName = supervisorName;
        this.activityType = activityType;
        this.activityDate = activityDate;
        this.organizingEntity = organizingEntity;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.phoneNumber = phoneNumber;
        this.description = description;
    }
}
