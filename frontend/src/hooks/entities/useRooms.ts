import { useDataFetching } from '@/hooks/base/useDataFetching';
import roomService from '@/services/entities/roomService';

export function useRooms() {
  return useDataFetching(['rooms'], () => roomService.list());
}


