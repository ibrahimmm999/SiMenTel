export default interface Room {
    id: string;
    name: string;
    floor: string;
    description: string;
    price: number;
    photo_url: string;
    occupancy_status: boolean;
    condition_status: boolean
  }