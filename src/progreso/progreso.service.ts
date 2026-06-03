import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NivelesService } from '../niveles/niveles.service';
import { CompletarNivelDto } from './dto/completar-nivel.dto';
import type { ProgresoCompletarResponse, EstadisticasUsuario } from '../types/juegos';

// Mensajes motivacionales de Lexy según rendimiento
const MENSAJES_LEXY = {
  perfecto: [
    '¡Increíble! ¡Lo hiciste perfecto! 🌟',
    '¡Eres una superestrella de las palabras! ⭐',
    '¡Lexy está muy orgullosa de ti! 💜',
  ],
  bien: [
    '¡Muy bien hecho! ¡Sigue así! 🎉',
    '¡Fantástico! Cada día mejoras más. 💪',
    '¡Lo lograste! Lexy baila de alegría. 🕺',
  ],
  regular: [
    '¡Casi! La próxima lo bordas. 😄',
    '¡Buen intento! Practica y lo conseguirás. 🌱',
    '¡No te rindas! Lexy cree en ti. 💜',
  ],
};

function mensajeLexy(aciertos: number, total: number): string {
  const ratio = aciertos / total;
  const pool =
    ratio === 1 ? MENSAJES_LEXY.perfecto
    : ratio >= 0.7 ? MENSAJES_LEXY.bien
    : MENSAJES_LEXY.regular;
  return pool[Math.floor(Math.random() * pool.length)];
}

@Injectable()
export class ProgresoService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly nivelesService: NivelesService,
  ) {}

  async completarNivel(dto: CompletarNivelDto): Promise<ProgresoCompletarResponse> {
    const db = this.supabase.db;

    // 1. Obtener nivel actual para calcular el siguiente
    const { data: nivelRow } = await db
      .from('niveles')
      .select('tipo_juego, numero_nivel')
      .eq('id', dto.nivelId)
      .single();

    if (!nivelRow) throw new NotFoundException('Nivel no encontrado');

    // 2. Upsert progreso del nivel
    await db.from('progreso_usuario').upsert(
      {
        usuario_id: dto.usuarioId,
        nivel_id: dto.nivelId,
        completado: true,
        puntos_obtenidos: dto.puntosObtenidos,
        aciertos: dto.aciertos,
        errores: dto.errores,
        tiempo_completado_segundos: dto.tiempoCompletadoSegundos,
        fecha_completado: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'usuario_id,nivel_id' },
    );

    // 3. Actualizar estadísticas del usuario
    const { data: statsRow } = await db
      .from('estadisticas_usuario')
      .select('*')
      .eq('usuario_id', dto.usuarioId)
      .single();

    const ahora = new Date();
    const ultimaActividad = statsRow?.ultima_actividad
      ? new Date(statsRow.ultima_actividad)
      : null;

    const esHoy = ultimaActividad
      ? new Date().toDateString() === ultimaActividad.toDateString()
      : false;

    const esDiaAnterior = ultimaActividad
      ? Math.abs(ahora.getTime() - ultimaActividad.getTime()) < 48 * 60 * 60 * 1000
      : false;

    const rachaActual = esHoy
      ? (statsRow?.racha_actual ?? 1)
      : esDiaAnterior
        ? (statsRow?.racha_actual ?? 0) + 1
        : 1;

    const rachaMaxima = Math.max(rachaActual, statsRow?.racha_maxima ?? 0);
    const puntosTotales = (statsRow?.puntos_totales ?? 0) + dto.puntosObtenidos;
    const nivelesCompletados = (statsRow?.niveles_completados ?? 0) + 1;

    await db.from('estadisticas_usuario').upsert(
      {
        usuario_id: dto.usuarioId,
        puntos_totales: puntosTotales,
        racha_actual: rachaActual,
        racha_maxima: rachaMaxima,
        niveles_completados: nivelesCompletados,
        ultima_actividad: ahora.toISOString(),
        updated_at: ahora.toISOString(),
      },
      { onConflict: 'usuario_id' },
    );

    const nuevasEstadisticas: EstadisticasUsuario = {
      puntosTotales,
      rachaActual,
      rachaMaxima,
      nivelesCompletados,
      ultimaActividad: ahora.toISOString(),
    };

    // 4. Obtener el siguiente nivel
    const siguienteNivel = await this.nivelesService.findNextNivel(
      nivelRow.tipo_juego,
      nivelRow.numero_nivel,
    );

    return {
      success: true,
      nuevasEstadisticas,
      siguienteNivel: siguienteNivel ?? undefined,
      logrosDesbloqueados: [],
      mensajeLexy: mensajeLexy(dto.aciertos, dto.aciertos + dto.errores),
    };
  }
}
