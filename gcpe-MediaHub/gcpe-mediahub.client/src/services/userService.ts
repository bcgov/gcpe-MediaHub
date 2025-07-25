import axios from 'axios';
import { User, MediaContact, MediaContactSimpleDto, MediaContactsApi } from '../api/generated-client';

// Create an axios instance with auth headers
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Basic ${btoa(import.meta.env.VITE_API_BASIC_AUTH ?? '')}`,
        'Content-Type': 'application/json'
    }
});

// Create API client instance
const mediaContactsApi = new MediaContactsApi(undefined, import.meta.env.VITE_API_URL, axiosInstance);

/**
 * Service for user-related operations
 */
export const userService = {
    /**
     * Get all users
     */
    async getUsers(): Promise<User[]> {
        const response = await axiosInstance.get<User[]>('Users');
        return response.data;
    },

    /**
     * Get user by IDIR
     */
    async getUserByIdir(idir: string): Promise<User> {
        try {
            const response = await axiosInstance.get<User>(`Users/${encodeURIComponent(idir)}`);
            return response.data;
        } catch (error) {
            console.error("Error in getUserByIdir:", error);
            throw error;
        }
    },

    /**
     * Get media contact by full name (FirstName LastName)
     */
    async getMediaContactByFullName(fullName: string): Promise<MediaContact> {
        try {
            const response = await axiosInstance.get<MediaContact>(
                `MediaContacts/search/${encodeURIComponent(fullName)}`
            );
            return response.data;
        } catch (error) {
            console.error("Error in getMediaContactByFullName:", error);
            throw error;
        }
    },

    /**
     * Get media contacts for dropdown usage (simplified data without circular references)
     */
    async getMediaContactsForDropdown(): Promise<MediaContactSimpleDto[]> {
        try {
            const response = await axiosInstance.get<MediaContactSimpleDto[]>('MediaContacts/for-dropdown');
            return response.data;
        } catch (error) {
            console.error("Error in getMediaContactsForDropdown:", error);
            throw error;
        }
    },

    /**
     * Get all user IDIRs (usernames)
     */
    async getUserIdirs(): Promise<string[]> {
        try {
            const response = await axiosInstance.get<User[]>('Users');
            // Use 'idir' as the IDIR field
            return response.data.map(user => user.idir).filter(Boolean);
        } catch (error) {
            console.error("Error in getUserIdirs:", error);
            throw error;
        }
    }
};