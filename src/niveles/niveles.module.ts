import { Module } from '@nestjs/common';
import { NivelesController } from './niveles.controller';
import { NivelesService } from './niveles.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [NivelesController],
  providers: [NivelesService, SupabaseService],
  exports: [NivelesService],
})
export class NivelesModule {}
