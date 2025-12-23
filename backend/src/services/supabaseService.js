// Supabase Service - Handles Real-time Notifications
// Manages user authentication and push notifications

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  static async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async sendNotification(userId, notification) {
    try {
      // Subscribe to real-time channel
      const channel = supabase
        .channel(`notifications:${userId}`)
        .on('broadcast', { event: 'notification' }, (payload) => {
          console.log('Notification received:', payload);
        })
        .subscribe();

      return channel;
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }

  static async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseService;
