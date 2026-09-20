export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      alimentos: {
        Row: {
          actualizado_en: string
          alergenos: string[]
          carbohidrato_g_100g: number | null
          categoria: string | null
          consultorio_id: string
          creado_en: string
          creado_por: string | null
          energia_kcal_100g: number | null
          estado_coccion: string | null
          fecha_fuente: string | null
          fibra_g_100g: number | null
          fuente_id: string | null
          grasa_g_100g: number | null
          id: string
          marca: string | null
          nombre: string
          porcion_descripcion: string | null
          porcion_gramos: number | null
          proteina_g_100g: number | null
          sodio_mg_100g: number | null
        }
        Insert: {
          actualizado_en?: string
          alergenos?: string[]
          carbohidrato_g_100g?: number | null
          categoria?: string | null
          consultorio_id: string
          creado_en?: string
          creado_por?: string | null
          energia_kcal_100g?: number | null
          estado_coccion?: string | null
          fecha_fuente?: string | null
          fibra_g_100g?: number | null
          fuente_id?: string | null
          grasa_g_100g?: number | null
          id?: string
          marca?: string | null
          nombre: string
          porcion_descripcion?: string | null
          porcion_gramos?: number | null
          proteina_g_100g?: number | null
          sodio_mg_100g?: number | null
        }
        Update: {
          actualizado_en?: string
          alergenos?: string[]
          carbohidrato_g_100g?: number | null
          categoria?: string | null
          consultorio_id?: string
          creado_en?: string
          creado_por?: string | null
          energia_kcal_100g?: number | null
          estado_coccion?: string | null
          fecha_fuente?: string | null
          fibra_g_100g?: number | null
          fuente_id?: string | null
          grasa_g_100g?: number | null
          id?: string
          marca?: string | null
          nombre?: string
          porcion_descripcion?: string | null
          porcion_gramos?: number | null
          proteina_g_100g?: number | null
          sodio_mg_100g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alimentos_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alimentos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alimentos_fuente_id_fkey"
            columns: ["fuente_id"]
            isOneToOne: false
            referencedRelation: "fuentes_nutricionales"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria: {
        Row: {
          accion: string
          actor_id: string | null
          creado_en: string
          detalle: Json | null
          entidad: string
          entidad_id: string | null
          id: string
        }
        Insert: {
          accion: string
          actor_id?: string | null
          creado_en?: string
          detalle?: Json | null
          entidad: string
          entidad_id?: string | null
          id?: string
        }
        Update: {
          accion?: string
          actor_id?: string | null
          creado_en?: string
          detalle?: Json | null
          entidad?: string
          entidad_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos: {
        Row: {
          ajuste_manual: Json | null
          consulta_id: string | null
          creado_en: string
          id: string
          paciente_id: string
          resultado: Json
          tipo: string
        }
        Insert: {
          ajuste_manual?: Json | null
          consulta_id?: string | null
          creado_en?: string
          id?: string
          paciente_id: string
          resultado: Json
          tipo: string
        }
        Update: {
          ajuste_manual?: Json | null
          consulta_id?: string | null
          creado_en?: string
          id?: string
          paciente_id?: string
          resultado?: Json
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      citas: {
        Row: {
          actualizado_en: string
          consultorio_id: string
          creado_en: string
          creado_por: string | null
          estado: Database["public"]["Enums"]["estado_cita"]
          fin: string
          id: string
          inicio: string
          motivo: string | null
          notas_internas: string | null
          paciente_id: string
        }
        Insert: {
          actualizado_en?: string
          consultorio_id: string
          creado_en?: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_cita"]
          fin: string
          id?: string
          inicio: string
          motivo?: string | null
          notas_internas?: string | null
          paciente_id: string
        }
        Update: {
          actualizado_en?: string
          consultorio_id?: string
          creado_en?: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_cita"]
          fin?: string
          id?: string
          inicio?: string
          motivo?: string | null
          notas_internas?: string | null
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citas_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      consentimientos: {
        Row: {
          fecha: string
          id: string
          notas: string | null
          otorgado: boolean
          paciente_id: string
          registrado_por: string | null
          tipo: string
        }
        Insert: {
          fecha?: string
          id?: string
          notas?: string | null
          otorgado: boolean
          paciente_id: string
          registrado_por?: string | null
          tipo: string
        }
        Update: {
          fecha?: string
          id?: string
          notas?: string | null
          otorgado?: boolean
          paciente_id?: string
          registrado_por?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "consentimientos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consentimientos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas: {
        Row: {
          acuerdos: string | null
          creado_en: string
          evaluacion: string | null
          fecha: string
          id: string
          motivo: string | null
          notas_internas: string | null
          paciente_id: string
          proxima_revision: string | null
          responsable_id: string
        }
        Insert: {
          acuerdos?: string | null
          creado_en?: string
          evaluacion?: string | null
          fecha?: string
          id?: string
          motivo?: string | null
          notas_internas?: string | null
          paciente_id: string
          proxima_revision?: string | null
          responsable_id: string
        }
        Update: {
          acuerdos?: string | null
          creado_en?: string
          evaluacion?: string | null
          fecha?: string
          id?: string
          motivo?: string | null
          notas_internas?: string | null
          paciente_id?: string
          proxima_revision?: string | null
          responsable_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultorios: {
        Row: {
          creado_en: string
          duracion_cita_minutos: number
          horario_atencion: Json
          id: string
          moneda: string
          nombre: string
          zona_horaria: string
        }
        Insert: {
          creado_en?: string
          duracion_cita_minutos?: number
          horario_atencion?: Json
          id?: string
          moneda?: string
          nombre: string
          zona_horaria?: string
        }
        Update: {
          creado_en?: string
          duracion_cita_minutos?: number
          horario_atencion?: Json
          id?: string
          moneda?: string
          nombre?: string
          zona_horaria?: string
        }
        Relationships: []
      }
      documento_versiones: {
        Row: {
          creado_en: string
          documento_id: string
          id: string
          numero_version: number
          storage_path: string
          subido_por: string | null
        }
        Insert: {
          creado_en?: string
          documento_id: string
          id?: string
          numero_version: number
          storage_path: string
          subido_por?: string | null
        }
        Update: {
          creado_en?: string
          documento_id?: string
          id?: string
          numero_version?: number
          storage_path?: string
          subido_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documento_versiones_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_versiones_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          categoria: string
          creado_en: string
          creado_por: string | null
          id: string
          nombre: string
          paciente_id: string
          visibilidad: string
        }
        Insert: {
          categoria: string
          creado_en?: string
          creado_por?: string | null
          id?: string
          nombre: string
          paciente_id: string
          visibilidad?: string
        }
        Update: {
          categoria?: string
          creado_en?: string
          creado_por?: string | null
          id?: string
          nombre?: string
          paciente_id?: string
          visibilidad?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      fotografias: {
        Row: {
          consentimiento_id: string | null
          consulta_id: string | null
          creado_en: string
          fecha_captura: string
          fecha_carga: string
          id: string
          observaciones: string | null
          paciente_id: string
          storage_path: string
          subido_por: string | null
          visibilidad: string
          vista: string
        }
        Insert: {
          consentimiento_id?: string | null
          consulta_id?: string | null
          creado_en?: string
          fecha_captura: string
          fecha_carga?: string
          id?: string
          observaciones?: string | null
          paciente_id: string
          storage_path: string
          subido_por?: string | null
          visibilidad?: string
          vista: string
        }
        Update: {
          consentimiento_id?: string | null
          consulta_id?: string | null
          creado_en?: string
          fecha_captura?: string
          fecha_carga?: string
          id?: string
          observaciones?: string | null
          paciente_id?: string
          storage_path?: string
          subido_por?: string | null
          visibilidad?: string
          vista?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotografias_consentimiento_id_fkey"
            columns: ["consentimiento_id"]
            isOneToOne: false
            referencedRelation: "consentimientos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotografias_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotografias_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotografias_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuentes_nutricionales: {
        Row: {
          id: string
          licencia_resuelta: boolean
          nombre: string
          notas: string | null
          url: string | null
          version: string | null
        }
        Insert: {
          id?: string
          licencia_resuelta?: boolean
          nombre: string
          notas?: string | null
          url?: string | null
          version?: string | null
        }
        Update: {
          id?: string
          licencia_resuelta?: boolean
          nombre?: string
          notas?: string | null
          url?: string | null
          version?: string | null
        }
        Relationships: []
      }
      mediciones: {
        Row: {
          cadera_cm: number | null
          cintura_cm: number | null
          consulta_id: string | null
          creado_en: string
          fecha: string
          fuente: string | null
          id: string
          masa_muscular_kg: number | null
          paciente_id: string
          peso_kg: number | null
          porcentaje_grasa: number | null
          reportado_por_paciente: boolean
          revisado_por_nutriologa: boolean
          talla_cm: number | null
        }
        Insert: {
          cadera_cm?: number | null
          cintura_cm?: number | null
          consulta_id?: string | null
          creado_en?: string
          fecha?: string
          fuente?: string | null
          id?: string
          masa_muscular_kg?: number | null
          paciente_id: string
          peso_kg?: number | null
          porcentaje_grasa?: number | null
          reportado_por_paciente?: boolean
          revisado_por_nutriologa?: boolean
          talla_cm?: number | null
        }
        Update: {
          cadera_cm?: number | null
          cintura_cm?: number | null
          consulta_id?: string | null
          creado_en?: string
          fecha?: string
          fuente?: string | null
          id?: string
          masa_muscular_kg?: number | null
          paciente_id?: string
          peso_kg?: number | null
          porcentaje_grasa?: number | null
          reportado_por_paciente?: boolean
          revisado_por_nutriologa?: boolean
          talla_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mediciones_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mediciones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes: {
        Row: {
          autor_id: string
          autor_rol: Database["public"]["Enums"]["rol_usuario"]
          creado_en: string
          cuerpo: string
          id: string
          leido_en: string | null
          paciente_id: string
        }
        Insert: {
          autor_id: string
          autor_rol: Database["public"]["Enums"]["rol_usuario"]
          creado_en?: string
          cuerpo: string
          id?: string
          leido_en?: string | null
          paciente_id: string
        }
        Update: {
          autor_id?: string
          autor_rol?: Database["public"]["Enums"]["rol_usuario"]
          creado_en?: string
          cuerpo?: string
          id?: string
          leido_en?: string | null
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensajes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          actualizado_en: string
          alergias_intolerancias: Json
          antecedentes: Json
          consultorio_id: string
          contacto_emergencia_nombre: string | null
          contacto_emergencia_telefono: string | null
          creado_en: string
          creado_por: string | null
          email: string | null
          estado: string
          fecha_nacimiento: string | null
          habitos: Json
          id: string
          medicamentos_suplementos: Json
          nombre_completo: string
          objetivos: string | null
          preferencias_alimentarias: Json
          sexo: string | null
          telefono: string | null
        }
        Insert: {
          actualizado_en?: string
          alergias_intolerancias?: Json
          antecedentes?: Json
          consultorio_id: string
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_telefono?: string | null
          creado_en?: string
          creado_por?: string | null
          email?: string | null
          estado?: string
          fecha_nacimiento?: string | null
          habitos?: Json
          id?: string
          medicamentos_suplementos?: Json
          nombre_completo: string
          objetivos?: string | null
          preferencias_alimentarias?: Json
          sexo?: string | null
          telefono?: string | null
        }
        Update: {
          actualizado_en?: string
          alergias_intolerancias?: Json
          antecedentes?: Json
          consultorio_id?: string
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_telefono?: string | null
          creado_en?: string
          creado_por?: string | null
          email?: string | null
          estado?: string
          fecha_nacimiento?: string | null
          habitos?: Json
          id?: string
          medicamentos_suplementos?: Json
          nombre_completo?: string
          objetivos?: string | null
          preferencias_alimentarias?: Json
          sexo?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pacientes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          concepto: string
          creado_en: string
          fecha: string
          id: string
          metodo: string
          monto: number
          paciente_id: string
          registrado_por: string | null
          servicio_id: string | null
        }
        Insert: {
          concepto: string
          creado_en?: string
          fecha?: string
          id?: string
          metodo: string
          monto: number
          paciente_id: string
          registrado_por?: string | null
          servicio_id?: string | null
        }
        Update: {
          concepto?: string
          creado_en?: string
          fecha?: string
          id?: string
          metodo?: string
          monto?: number
          paciente_id?: string
          registrado_por?: string | null
          servicio_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_dias: {
        Row: {
          etiqueta: string | null
          id: string
          numero_dia: number
          plan_id: string
        }
        Insert: {
          etiqueta?: string | null
          id?: string
          numero_dia: number
          plan_id: string
        }
        Update: {
          etiqueta?: string | null
          id?: string
          numero_dia?: number
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_dias_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_items: {
        Row: {
          alimento_id: string | null
          cantidad_gramos: number
          id: string
          notas: string | null
          orden: number
          plan_tiempo_id: string
          receta_id: string | null
        }
        Insert: {
          alimento_id?: string | null
          cantidad_gramos: number
          id?: string
          notas?: string | null
          orden?: number
          plan_tiempo_id: string
          receta_id?: string | null
        }
        Update: {
          alimento_id?: string | null
          cantidad_gramos?: number
          id?: string
          notas?: string | null
          orden?: number
          plan_tiempo_id?: string
          receta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_items_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_items_plan_tiempo_id_fkey"
            columns: ["plan_tiempo_id"]
            isOneToOne: false
            referencedRelation: "plan_tiempos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_items_receta_id_fkey"
            columns: ["receta_id"]
            isOneToOne: false
            referencedRelation: "recetas"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_tiempos: {
        Row: {
          id: string
          nombre: string
          orden: number
          plan_dia_id: string
          porcentaje_asignado: number | null
        }
        Insert: {
          id?: string
          nombre: string
          orden?: number
          plan_dia_id: string
          porcentaje_asignado?: number | null
        }
        Update: {
          id?: string
          nombre?: string
          orden?: number
          plan_dia_id?: string
          porcentaje_asignado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_tiempos_plan_dia_id_fkey"
            columns: ["plan_dia_id"]
            isOneToOne: false
            referencedRelation: "plan_dias"
            referencedColumns: ["id"]
          },
        ]
      }
      planes: {
        Row: {
          actualizado_en: string
          aprobado_en: string | null
          aprobado_por: string | null
          creado_en: string
          creado_por: string | null
          estado: string
          id: string
          nombre: string
          objetivo_kcal: number | null
          objetivo_macros: Json | null
          paciente_id: string
          plan_anterior_id: string | null
          publicado_en: string | null
          recomendaciones: string | null
          version: number
          vigente_desde: string | null
          vigente_hasta: string | null
        }
        Insert: {
          actualizado_en?: string
          aprobado_en?: string | null
          aprobado_por?: string | null
          creado_en?: string
          creado_por?: string | null
          estado?: string
          id?: string
          nombre: string
          objetivo_kcal?: number | null
          objetivo_macros?: Json | null
          paciente_id: string
          plan_anterior_id?: string | null
          publicado_en?: string | null
          recomendaciones?: string | null
          version?: number
          vigente_desde?: string | null
          vigente_hasta?: string | null
        }
        Update: {
          actualizado_en?: string
          aprobado_en?: string | null
          aprobado_por?: string | null
          creado_en?: string
          creado_por?: string | null
          estado?: string
          id?: string
          nombre?: string
          objetivo_kcal?: number | null
          objetivo_macros?: Json | null
          paciente_id?: string
          plan_anterior_id?: string | null
          publicado_en?: string | null
          recomendaciones?: string | null
          version?: number
          vigente_desde?: string | null
          vigente_hasta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planes_aprobado_por_fkey"
            columns: ["aprobado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planes_plan_anterior_id_fkey"
            columns: ["plan_anterior_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activo: boolean
          consultorio_id: string
          creado_en: string
          id: string
          nombre_completo: string
          paciente_id: string | null
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Insert: {
          activo?: boolean
          consultorio_id: string
          creado_en?: string
          id: string
          nombre_completo: string
          paciente_id?: string | null
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Update: {
          activo?: boolean
          consultorio_id?: string
          creado_en?: string
          id?: string
          nombre_completo?: string
          paciente_id?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      receta_ingredientes: {
        Row: {
          alimento_id: string
          gramos: number
          id: string
          orden: number
          receta_id: string
        }
        Insert: {
          alimento_id: string
          gramos: number
          id?: string
          orden?: number
          receta_id: string
        }
        Update: {
          alimento_id?: string
          gramos?: number
          id?: string
          orden?: number
          receta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receta_ingredientes_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receta_ingredientes_receta_id_fkey"
            columns: ["receta_id"]
            isOneToOne: false
            referencedRelation: "recetas"
            referencedColumns: ["id"]
          },
        ]
      }
      recetas: {
        Row: {
          actualizado_en: string
          consultorio_id: string
          creado_en: string
          creado_por: string | null
          fotografia_url: string | null
          id: string
          nombre: string
          preparacion: string | null
          rendimiento_porciones: number
        }
        Insert: {
          actualizado_en?: string
          consultorio_id: string
          creado_en?: string
          creado_por?: string | null
          fotografia_url?: string | null
          id?: string
          nombre: string
          preparacion?: string | null
          rendimiento_porciones?: number
        }
        Update: {
          actualizado_en?: string
          consultorio_id?: string
          creado_en?: string
          creado_por?: string | null
          fotografia_url?: string | null
          id?: string
          nombre?: string
          preparacion?: string | null
          rendimiento_porciones?: number
        }
        Relationships: [
          {
            foreignKeyName: "recetas_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recetas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_laboratorio: {
        Row: {
          consulta_id: string | null
          creado_en: string
          documento_id: string | null
          fecha: string
          id: string
          indicador: string
          paciente_id: string
          rango_referencia: string | null
          unidad: string | null
          valor: number | null
        }
        Insert: {
          consulta_id?: string | null
          creado_en?: string
          documento_id?: string | null
          fecha: string
          id?: string
          indicador: string
          paciente_id: string
          rango_referencia?: string | null
          unidad?: string | null
          valor?: number | null
        }
        Update: {
          consulta_id?: string | null
          creado_en?: string
          documento_id?: string | null
          fecha?: string
          id?: string
          indicador?: string
          paciente_id?: string
          rango_referencia?: string | null
          unidad?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resultados_laboratorio_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultados_laboratorio_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          activo: boolean
          consultorio_id: string
          creado_en: string
          descripcion: string | null
          id: string
          nombre: string
          precio: number
        }
        Insert: {
          activo?: boolean
          consultorio_id: string
          creado_en?: string
          descripcion?: string | null
          id?: string
          nombre: string
          precio: number
        }
        Update: {
          activo?: boolean
          consultorio_id?: string
          creado_en?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          precio?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicios_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "consultorios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_paciente_id: { Args: never; Returns: string }
      auth_rol: {
        Args: never
        Returns: Database["public"]["Enums"]["rol_usuario"]
      }
      documento_visible_para_paciente: {
        Args: { p_storage_path: string }
        Returns: boolean
      }
      es_dueno_paciente: { Args: { p_paciente_id: string }; Returns: boolean }
      es_nutriologa: { Args: never; Returns: boolean }
      es_staff: { Args: never; Returns: boolean }
      foto_visible_para_paciente: {
        Args: { p_storage_path: string }
        Returns: boolean
      }
    }
    Enums: {
      estado_cita: "pendiente" | "confirmada" | "cancelada" | "completada"
      rol_usuario: "nutriologa" | "asistente" | "paciente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado_cita: ["pendiente", "confirmada", "cancelada", "completada"],
      rol_usuario: ["nutriologa", "asistente", "paciente"],
    },
  },
} as const
