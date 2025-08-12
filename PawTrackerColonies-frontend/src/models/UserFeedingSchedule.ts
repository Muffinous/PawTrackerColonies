import User from "./User";

interface UserFeedingSchedule {
    id: string;
    user: UserDto;
    colony: ColonyDto;
    dayOfWeek: string;
}

interface UserDto {
    uid: string;
    username: string;
    name: string;
    lastname: string;
    email: string;
    profileImg: string;
    phoneNumber: string;
    reports: string[];
}


interface ColonyDto {
    id: string;
    name: string;
    numberOfCats: number;
    location: string;
}
export default UserFeedingSchedule;