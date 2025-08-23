import { ApiService } from "../base/apiService";

export type CreateMakeupClassesPayload = {
  level_choice: string; // course.name
  class_id: string;
  course_date: string; // YYYY-MM-DD (Course.created_date)
  term: number;
  teacher_id: string;
  room_id: string;
};

class MakeupClassService extends ApiService {
  async createMakeupClasses(payload: CreateMakeupClassesPayload) {
    return this.post<{ message: string }>(
      "/makeup_class/learningadvisor/add",
      payload
    );
  }

  async getMakeupClasses() {
    return this.get<any[]>("/makeup_class/learningadvisor/");
  }
}

export default new MakeupClassService();


