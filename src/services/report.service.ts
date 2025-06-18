// src/services/colonyReport.service.ts
import axios from 'axios';
import { API_URL } from '../config/api';
import ColonyReport from '../models/ColonyReport';
import api from './api';

const getReports = async (): Promise<ColonyReport[]> => {
  const response = await api.get<ColonyReport[]>('/colonyReports');
  return response.data;
};

const getReportById = async (id: string): Promise<ColonyReport> => {
  const response = await api.get<ColonyReport>(`/colonyReports/${id}`);
  return response.data;
};

const createReport = async (report: Partial<ColonyReport>): Promise<ColonyReport> => {
  const response = await api.post<ColonyReport>('/colonyReports', report);
  return response.data;
};

const updateReport = async (id: string, report: Partial<ColonyReport>): Promise<ColonyReport> => {
  const response = await api.put<ColonyReport>(`/colonyReports/${id}`, report);
  return response.data;
};

const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/colonyReports/${id}`);
};

const getReportsByUserId = (uuid: string): Promise<ColonyReport[]> => {
  const token = localStorage.getItem('token');
  console.log("tokennn ", token)
  return axios
    .get(`${API_URL}/reports/by-userId/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching reports", error);
      throw new Error("Error fetching reports");
    });
}

// Exportar todo como un único objeto
const ReportsService = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportsByUserId,
};

export default ReportsService;