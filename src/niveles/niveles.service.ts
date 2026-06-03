import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NivelResponseDto } from './dto/nivel-response.dto';
import type { TipoJuego } from '../types/juegos';

@Injectable()
export class NivelesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findByTipoJuego(tipoJuego: TipoJuego): Promise<NivelResponseDto[]> {
    const { data, error } = await this.supabase.db
      .from('niveles')
      .select('*')
      .eq('tipo_juego', tipoJuego)
      .eq('activo', true)
      .order('numero_nivel', { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map(NivelResponseDto.fromRow);
  }

  async findOne(tipoJuego: TipoJuego, nivelId: string): Promise<NivelResponseDto> {
    const { data, error } = await this.supabase.db
      .from('niveles')
      .select('*')
      .eq('id', nivelId)
      .eq('tipo_juego', tipoJuego)
      .eq('activo', true)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Nivel ${nivelId} no encontrado`);
    }

    return NivelResponseDto.fromRow(data);
  }

  async findNextNivel(
    tipoJuego: TipoJuego,
    numeroNivelActual: number,
  ): Promise<NivelResponseDto | null> {
    const { data } = await this.supabase.db
      .from('niveles')
      .select('*')
      .eq('tipo_juego', tipoJuego)
      .eq('activo', true)
      .gt('numero_nivel', numeroNivelActual)
      .order('numero_nivel', { ascending: true })
      .limit(1)
      .maybeSingle();

    return data ? NivelResponseDto.fromRow(data) : null;
  }
}
