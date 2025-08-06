import { ApiService } from '../base/apiService';
import { getUserRole } from '../../lib/utils';
import type { Issue, IssueFormData } from '../../types/issue';
import { getEmployeeIdFromToken } from '../../lib/utils';

class IssueService extends ApiService {
  // Get all issues (for Learning Advisor and Manager)
  async getAllIssues(): Promise<Issue[]> {
    return this.get<Issue[]>('/issue/view');
  }

  // Create new issue (for Teacher)
  async createIssue(issueData: IssueFormData): Promise<Issue> {
    return this.post<Issue>('/issue/create', issueData);
  }

  // Update issue status to "Done" (for Learning Advisor and Manager)
  async updateIssue(id: string): Promise<Issue> {
    return this.put<Issue>(`/issue/update/${id}`, {});
  }

  // Role-based method to get appropriate issues
  async getIssuesByRole(): Promise<Issue[]> {
    const userRole = getUserRole();
    if (userRole === 'Teacher') {
      const teacherId = getEmployeeIdFromToken();
      if (!teacherId) {
        console.warn('⚠️ No teacher ID found in token');
        return [];
      }
      return this.get<Issue[]>(`/issue/view/${teacherId}`);
    }
    if (userRole === 'Learning Advisor' || userRole === 'Manager') {
      return this.getAllIssues();
    }
    console.warn('⚠️ Unknown role for issues:', userRole);
    return [];
  }
}

export default new IssueService(); 