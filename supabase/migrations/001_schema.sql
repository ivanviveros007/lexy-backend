-- ─────────────────────────────────────────────────────────────────────────────
-- Lexy — Schema inicial de Supabase
-- ─────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum de tipos de juego
CREATE TYPE tipo_juego AS ENUM (
  'cazador_silabas',
  'palabras_gemelas',
  'intruso_rimas',
  'conductor_texto'
);

-- ── Tabla: niveles ────────────────────────────────────────────────────────────
-- configuracion es JSONB discriminado por ConfiguracionJuego
CREATE TABLE IF NOT EXISTS niveles (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_juego              tipo_juego NOT NULL,
  numero_nivel            INTEGER NOT NULL,
  titulo                  TEXT NOT NULL,
  descripcion             TEXT,
  dificultad              SMALLINT NOT NULL CHECK (dificultad BETWEEN 1 AND 5),
  puntos_recompensa       INTEGER NOT NULL DEFAULT 100,
  tiempo_limite_segundos  INTEGER,
  configuracion           JSONB NOT NULL,
  activo                  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tipo_juego, numero_nivel)
);

-- ── Tabla: usuarios ───────────────────────────────────────────────────────────
-- Extiende auth.users de Supabase (se crea via trigger en auth)
CREATE TABLE IF NOT EXISTS usuarios (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: estadisticas_usuario ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS estadisticas_usuario (
  usuario_id          UUID PRIMARY KEY REFERENCES usuarios (id) ON DELETE CASCADE,
  puntos_totales      INTEGER NOT NULL DEFAULT 0,
  racha_actual        INTEGER NOT NULL DEFAULT 0,
  racha_maxima        INTEGER NOT NULL DEFAULT 0,
  niveles_completados INTEGER NOT NULL DEFAULT 0,
  ultima_actividad    TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: progreso_usuario ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progreso_usuario (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id                  UUID NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  nivel_id                    UUID NOT NULL REFERENCES niveles (id),
  completado                  BOOLEAN NOT NULL DEFAULT FALSE,
  puntos_obtenidos            INTEGER NOT NULL DEFAULT 0,
  intentos                    INTEGER NOT NULL DEFAULT 0,
  aciertos                    INTEGER NOT NULL DEFAULT 0,
  errores                     INTEGER NOT NULL DEFAULT 0,
  tiempo_completado_segundos  INTEGER,
  fecha_completado            TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, nivel_id)
);

-- ── Tabla: logros ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS logros (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo       TEXT UNIQUE NOT NULL,
  titulo       TEXT NOT NULL,
  descripcion  TEXT NOT NULL,
  icono_url    TEXT,
  puntos_bonus INTEGER NOT NULL DEFAULT 0
);

-- ── Tabla: logros_usuario ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS logros_usuario (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id         UUID NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  logro_id           UUID NOT NULL REFERENCES logros (id),
  fecha_desbloqueo   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, logro_id)
);

-- ── Índices ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_niveles_tipo_juego        ON niveles (tipo_juego);
CREATE INDEX idx_progreso_usuario_id       ON progreso_usuario (usuario_id);
CREATE INDEX idx_progreso_nivel_id         ON progreso_usuario (nivel_id);
CREATE INDEX idx_estadisticas_usuario_id   ON estadisticas_usuario (usuario_id);

-- ── Trigger updated_at ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER niveles_updated_at
  BEFORE UPDATE ON niveles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER progreso_updated_at
  BEFORE UPDATE ON progreso_usuario
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER estadisticas_updated_at
  BEFORE UPDATE ON estadisticas_usuario
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE usuarios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadisticas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_usuario     ENABLE ROW LEVEL SECURITY;
ALTER TABLE logros_usuario       ENABLE ROW LEVEL SECURITY;

-- Los niveles son públicos (solo lectura para todos)
ALTER TABLE niveles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "niveles_select_all" ON niveles FOR SELECT USING (TRUE);

-- Cada usuario solo ve sus propios datos
CREATE POLICY "usuarios_own" ON usuarios
  USING (id = auth.uid());

CREATE POLICY "estadisticas_own" ON estadisticas_usuario
  USING (usuario_id = auth.uid());

CREATE POLICY "progreso_own" ON progreso_usuario
  USING (usuario_id = auth.uid());

CREATE POLICY "logros_usuario_own" ON logros_usuario
  USING (usuario_id = auth.uid());

-- El backend usa service_role key y bypasa RLS — las políticas protegen el client anon
