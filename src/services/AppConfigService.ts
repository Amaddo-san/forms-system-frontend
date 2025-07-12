import axios from "axios";
import { AppConfig } from "../models/AppConfig";

const BASE_URL = "/api/app-configs";

export const AppConfigService = {
    getAll: async (): Promise<AppConfig[]> => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },

    updateConfig: async (config: AppConfig): Promise<AppConfig> => {
        const response = await axios.put(`${BASE_URL}/${config.key}`, {
            key: config.key,
            value: config.value,
        });
        return response.data;
    },
};
