import axios from "axios";
import { User } from "../models/User";

const API_URL = "http://localhost:8081/api/users"; // Adjust if your base URL is different

export const UserService = {
    async searchProfessorsByName(keyword: string): Promise<User[]> {
        const response = await axios.get<User[]>(`${API_URL}/search/by-occupation`, {
            params: {
                occupation: "PROFESSOR", // fixed filter
                keyword, // backend should handle partial match
            },
        });
        return response.data;
    },

    async searchStudentsByUniversityId(keyword: string): Promise<User[]> {
        const response = await axios.get<User[]>(`${API_URL}/search/by-university-id`, {
            params: {
                keyword,
            },
        });
        return response.data;
    },
};
