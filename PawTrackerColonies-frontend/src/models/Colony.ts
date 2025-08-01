import { Cat } from "./Cat";
import { ColonyLocation } from "./Location";

interface Colony {
  id: string;
  name: string;
  totalCats: number;
  location: ColonyLocation;
  cats: Cat[];
}

export default Colony;
