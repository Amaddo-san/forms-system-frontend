import instance from "../config/AxiosConfig";
import { ActivityForm } from "../models/ActivityForm";
import { ActivityFormLog } from "../models/ActivityFormLog";

const BASE_URL = "http://localhost:8081/api/activity-forms";

export const ActivityFormService = {
    async submit(form: ActivityForm) {
        const response = await instance.post(BASE_URL, form, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    },

    async getAll(): Promise<ActivityForm[]> {
        const response = await instance.get<ActivityForm[]>(`${BASE_URL}/get-all`);
        return response.data;
    },

    async getById(id: string): Promise<ActivityForm> {
        const response = await instance.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    async getByUuid(uuid: string): Promise<ActivityForm> {
        const response = await instance.get(`${BASE_URL}/uuid/${uuid}`);
        return response.data;
    },

    async updateStatus(form: ActivityForm) {
        const response = await instance.post(`${BASE_URL}/update-status`, form, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    },

    async delete(form: ActivityForm) {
        const response = await instance.delete(`${BASE_URL}/delete`, {
            data: form,
            headers: { "Content-Type": "application/json" }
        } as any);
        return response.data;
    },

    async getPaginated(page: number, size: number): Promise<{
        content: ActivityForm[];
        totalPages: number;
        totalElements: number;
        number: number;
    }> {
        const response = await instance.get(`${BASE_URL}/paginated`, {
            params: { page, size }
        });
        return response.data;
    },

    async getLogsByUuid(uuid: string): Promise<ActivityFormLog[]> {
        const response = await instance.get(`${BASE_URL}/${uuid}/logs`);
        return response.data;
    }
};
