import axios from "axios";
import { AppConfig } from "../models/AppConfig";

const BASE_URL = "/api/app-configs";

interface AppConfigRequest {
    key: string;
    value: string;
}

export const AppConfigService = {
    // GET /api/app-configs
    getAll: async (): Promise<AppConfig[]> => {
        const res = await axios.get(BASE_URL);
        return res.data;
    },

    // GET /api/app-configs/{key}
    getByKey: async (key: string): Promise<AppConfig> => {
        const res = await axios.get(`${BASE_URL}/${key}`);
        return res.data;
    },

    // GET /api/app-configs/uuid/{uuid}
    getByUuid: async (uuid: string): Promise<AppConfig> => {
        const res = await axios.get(`${BASE_URL}/uuid/${uuid}`);
        return res.data;
    },

    // POST /api/app-configs
    create: async (request: AppConfigRequest): Promise<AppConfig> => {
        const res = await axios.post(BASE_URL, request);
        return res.data;
    },

    // PUT /api/app-configs/{key}
    update: async (key: string, request: AppConfigRequest): Promise<AppConfig> => {
        if (key !== request.key) {
            throw new Error("Key in path must match key in request body");
        }
        const res = await axios.put(`${BASE_URL}/${key}`, request);
        return res.data;
    },

    // DELETE /api/app-configs/{key}
    delete: async (key: string): Promise<void> => {
        await axios.delete(`${BASE_URL}/${key}`);
    }
};
