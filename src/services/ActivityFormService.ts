import axios from "axios";
import { ActivityForm } from "../models/ActivityForm";

const BASE_URL = "http://localhost:8081/api/activity-forms";

export const ActivityFormService = {
    async submit(form: ActivityForm) {
        const response = await axios.post(BASE_URL, form, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    },

    async getAll(): Promise<ActivityForm[]> {
        const response = await axios.get(`${BASE_URL}/get-all`);
        return response.data;
    },

    async updateStatus(form: ActivityForm) {
        const response = await axios.post(`${BASE_URL}/update-status`, form, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    },

    async delete(form: ActivityForm) {
        const response = await axios.delete(`${BASE_URL}/delete`, {
            data: form,
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    }
};
