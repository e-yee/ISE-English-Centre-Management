import { ApiService } from '../base/apiService';
import { getUserRole } from '@/lib/utils';
import type { Room } from '@/types/room';

type CreateRoom = { name: string };

class RoomService extends ApiService {
  async list(): Promise<Room[]> {
    const role = getUserRole();
    if (role !== 'Manager') return [];
    return this.get<Room[]>('/room/manager/');
  }

  async create(data: CreateRoom): Promise<Room> {
    const role = getUserRole();
    if (role !== 'Manager') throw new Error('Only Manager can create room');
    return this.post<Room>('/room/manager/add', data);
  }

  async remove(id: string): Promise<{ message: string }>{
    const role = getUserRole();
    if (role !== 'Manager') throw new Error('Only Manager can delete room');
    return this.delete<{ message: string }>(`/room/manager/delete?id=${id}`);
  }
}

export default new RoomService();


