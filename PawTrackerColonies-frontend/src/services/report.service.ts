// src/services/colonyReport.service.ts
import axios from 'axios';
import { API_URL } from '../config/api';
import ColonyReport from '../models/ColonyReport';
import api from './api';
import { ColonyReportRequest } from '../models/ColonyReportRequest';

const getReports = async (): Promise<ColonyReport[]> => {
  const response = await api.get<ColonyReport[]>('/colonyReports');
  return response.data;
};

const getReportById = async (id: string): Promise<ColonyReport> => {
  const token = localStorage.getItem('token');
  console.log("tokennn ", token)
  return axios
    .get(`${API_URL}/colonyReports/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching reports", error);
      throw new Error("Error fetching reports");
    });
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
    .get(`${API_URL}/colonyReports/by-userId/${uuid}`, {
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

const saveColonyReport = async (report: ColonyReportRequest): Promise<ColonyReport> => {
  const token = localStorage.getItem('token');

  return axios
    .post(`${API_URL}/colonyReports`, report, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error saving report", error);
      throw new Error("Error saving report");
    });
};

// Exportar todo como un único objeto
const ReportsService = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportsByUserId,
  saveColonyReport
};

export default ReportsService;