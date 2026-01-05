// js/feedback-service.js
import { supabase } from './supa.js';

export class FeedbackService {
  async getAll() {
    const result = await supabase
      .from('feedback')
      .select('created_at, rating, comment, full_name')
      .order('created_at', { ascending: false });

    return result;
  }
}