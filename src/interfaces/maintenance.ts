import Room from "./room";
import User from "./user";

export default interface Maintenance {
  id: number;
  description: string;
  room_id: number;
  user_id: number;
  assign_time: string;
  work_time: string;
  status: string;
  evidence_url: string;
  room?: Room;
  detail: string;
  user?: User;
}
