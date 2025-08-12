import Colony from "./Colony";
import User from "./User";

export interface UserFeedingScheduleResponse {
    user: User;
    colonies: ColonySchedule[];
}

export interface ColonySchedule {
    colony: Colony;
    dayOfWeek: string;
}