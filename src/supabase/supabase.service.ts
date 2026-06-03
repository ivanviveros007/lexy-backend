import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  onModuleInit() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new Error('SUPABASE_URL y SUPABASE_SERVICE_KEY son obligatorias');
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  get db(): SupabaseClient {
    return this.client;
  }
}
