import { Cat } from "./Cat";
import { ColonyLocation } from "./Location";

interface UserColony {
    id: string;
    userId: string;
    colonyId: string;
    name: string;
    cats: Cat[];
    location: ColonyLocation;
    activeFeeding: boolean;
}

export default UserColony;
