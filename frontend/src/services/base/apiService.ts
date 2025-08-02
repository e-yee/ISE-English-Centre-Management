import { api } from '@/lib/apiClient';

export class ApiService {
  protected async get<T>(endpoint: string): Promise<T> {
    return api.get<T>(endpoint);
  }
  
  protected async post<T>(endpoint: string, data: any): Promise<T> {
    return api.post<T>(endpoint, data);
  }
  
  protected async put<T>(endpoint: string, data: any): Promise<T> {
    return api.put<T>(endpoint, data);
  }
  
  protected async patch<T>(endpoint: string, data: any): Promise<T> {
    return api.patch<T>(endpoint, data);
  }
  
  protected async delete<T>(endpoint: string): Promise<T> {
    return api.delete<T>(endpoint);
  }
} 