import { Module } from '@nestjs/common';
import { ProgresoController } from './progreso.controller';
import { ProgresoService } from './progreso.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NivelesModule } from '../niveles/niveles.module';

@Module({
  imports: [NivelesModule],
  controllers: [ProgresoController],
  providers: [ProgresoService, SupabaseService],
})
export class ProgresoModule {}
