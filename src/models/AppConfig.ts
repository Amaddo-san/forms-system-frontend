export interface AppConfig {
    id: number;
    uuid: string;
    key: string;
    value: string;
    createdAt: string;        // use string to represent ISO date from backend
    lastUpdatedAt: string;    // use string to represent ISO date-time
}
