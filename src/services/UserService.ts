import instance from "../config/AxiosConfig";  // 👈 correct import of your custom instance
import { User } from "../models/User";

const API_URL = "/api/users"; // baseURL is already set in axios-instance

export const UserService = {
    async searchProfessorsByName(keyword: string): Promise<User[]> {
        const response = await instance.get<User[]>(`${API_URL}/search/by-occupation`, {
            params: {
                occupation: "PROFESSOR",
                keyword,
            },
        });
        return response.data;
    },

    async searchStudentsByUniversityId(keyword: string): Promise<User[]> {
        const response = await instance.get<User[]>(`${API_URL}/search/by-university-id`, {
            params: {
                keyword,
            },
        });
        return response.data;
    },
};
