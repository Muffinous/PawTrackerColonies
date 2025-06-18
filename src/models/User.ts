import Colony from "./Colony";

interface User {
    uid: string;
    username: string;
    name: string;
    lastname: string;
    email: string;
    colonies: Colony[];
    profilePicture: string;
    phoneNumber: string;
    reports: string[]
  }

  export default User;
