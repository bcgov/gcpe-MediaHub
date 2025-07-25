
import { apiClient } from '../api/apiClient';

import axios from 'axios';
import MediaContact from '../models/mediaContact';
import { SocialMediaCompany } from '../models/SocialMediaCompany';
import { JobTitle } from '../models/JobTitle';
// Type guard to validate the shape of mock data
function isValidMediaContact(contact: any): contact is MediaContact {
    return (
        typeof contact === 'object' &&
        typeof contact.Id === 'string' // && other validation concerns go below.
    );
}

// Create an axios instance with auth headers
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Basic ${btoa(import.meta.env.VITE_API_BASIC_AUTH ?? '')}`,
        'Content-Type': 'application/json'
    }
});

export const contactService = {
    async getContacts(): Promise<MediaContact[]> {
        const response = await axiosInstance.get<MediaContact[]>('MediaContacts');
        return response.data;
    },

    async getSocialMedias(): Promise<SocialMediaCompany[]> {
        const response = await axiosInstance.get<SocialMediaCompany[]>(`mediacontacts/GetSocialMedias`);
        return response.data;
    },

    async createContact(contact: MediaContact): Promise<MediaContact> {
        const response = await axiosInstance.post<MediaContact>('MediaContacts', contact);
        return response.data;
    },

    async getJobTitles(): Promise<JobTitle[]> {
        const response = await axiosInstance.get<JobTitle[]>('mediaContacts/GetJobTitles');
        return response.data;
    },
};