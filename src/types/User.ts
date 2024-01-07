import Colony from "./Colony";

interface User {
    uid: string;
    username: string;
    name: string;
    lastname: string;
    email: string;
    colonies: Colony[];
    profilePicture: string;
  }

  export default User;
