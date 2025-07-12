import axios from "axios";
import { AppConfig } from "../models/AppConfig";
import instance from "../config/AxiosConfig";

const BASE_URL = "/api/app-configs";


export const AppConfigService = {
    getAll: async (): Promise<AppConfig[]> => {
       const response = await axios.get<AppConfig[]>(BASE_URL);
    return response.data;
 
    },

    create: async (data: { key: string; value: string }): Promise<AppConfig> => {
  const response = await instance.post<AppConfig>("/api/app-configs", data);
  return response.data;
},


    updateConfig: async (config: AppConfig): Promise<AppConfig> => {
       const response = await axios.put<AppConfig>(`${BASE_URL}/${config.key}`, {
    value: config.value,
});

return response.data;

    },
};

