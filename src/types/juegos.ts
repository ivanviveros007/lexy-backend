// ─────────────────────────────────────────────────────────────────────────────
// CONTRATO CANÓNICO — idéntico a mobile/types/juegos.ts
// ─────────────────────────────────────────────────────────────────────────────

export type TipoJuego =
  | 'cazador_silabas'
  | 'palabras_gemelas'
  | 'intruso_rimas'
  | 'conductor_texto';

export interface PalabraConSilabas {
  palabra: string;
  silabas: string[];
  imagenUrl?: string;
}

export interface ConfigCazadorSilabas {
  tipo: 'cazador_silabas';
  palabras: PalabraConSilabas[];
  minAciertos: number;
}

export interface ParPalabras {
  palabraA: string;
  palabraB: string;
  sonGemelas: boolean;
}

export interface ConfigPalabrasGemelas {
  tipo: 'palabras_gemelas';
  pares: ParPalabras[];
  minAciertos: number;
}

export interface GrupoRimas {
  palabras: string[];
  intruso: string;
}

export interface ConfigIntrusoRimas {
  tipo: 'intruso_rimas';
  grupos: GrupoRimas[];
  minAciertos: number;
}

export interface PreguntaTexto {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

export interface ConfigConductorTexto {
  tipo: 'conductor_texto';
  texto: string;
  preguntas: PreguntaTexto[];
  minAciertos: number;
}

export type ConfiguracionJuego =
  | ConfigCazadorSilabas
  | ConfigPalabrasGemelas
  | ConfigIntrusoRimas
  | ConfigConductorTexto;

export interface Nivel {
  id: string;
  tipoJuego: TipoJuego;
  numeroNivel: number;
  titulo: string;
  descripcion?: string;
  dificultad: 1 | 2 | 3 | 4 | 5;
  puntosRecompensa: number;
  tiempoLimiteSegundos?: number;
  configuracion: ConfiguracionJuego;
}

export interface EstadisticasUsuario {
  puntosTotales: number;
  rachaActual: number;
  rachaMaxima: number;
  nivelesCompletados: number;
  ultimaActividad?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  avatarUrl?: string;
  estadisticas: EstadisticasUsuario;
}

export interface ProgresoCompletarPayload {
  usuarioId: string;
  nivelId: string;
  puntosObtenidos: number;
  tiempoCompletadoSegundos: number;
  aciertos: number;
  errores: number;
}

export interface ProgresoCompletarResponse {
  success: boolean;
  nuevasEstadisticas: EstadisticasUsuario;
  siguienteNivel?: Nivel;
  logrosDesbloqueados: string[];
  mensajeLexy: string;
}
