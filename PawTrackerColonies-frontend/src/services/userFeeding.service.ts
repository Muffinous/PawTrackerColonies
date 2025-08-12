import axios from "axios";
import { API_URL } from "../config/api";
import UserFeedingSchedule from "../models/UserFeedingSchedule";
import { UserFeedingScheduleResponse } from "../models/UserFeedingScheduleResponse";


const getAllUserFeedingSchedulesByColonyId = async (colonyId: string): Promise<UserFeedingSchedule[]> => {
    const token = localStorage.getItem('token');

    return axios
        .get(`${API_URL}/feeding-schedule/colony/${colonyId}/feeders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => { return response.data; })
        .catch((error) => {
            console.error("Error fetching all feeding schedules by colony ID", error);
            throw new Error("Error fetching all feeding schedules by colony ID");
        });
};

const getAllUserFeedingSchedules = async (userId: string): Promise<UserFeedingScheduleResponse> => {
    const token = localStorage.getItem('token');

    return axios
        .get(`${API_URL}/feeding-schedule/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => { console.log("res", response.data); return response.data; })
        .catch((error) => {
            console.error("Error fetching all feeders by colony ID", error);
            throw new Error("Error fetching all feeders by colony ID");
        });
};

const UserFeedingScheduleService = {
    getAllUserFeedingSchedulesByColonyId,
    getAllUserFeedingSchedules
};

export default UserFeedingScheduleService;

