import { Timestamp } from "firebase/firestore"

export type Actuacion = {
  concepto: string,
  fecha: Timestamp,
  idActuacion: string,
  idRepertorio: string,
  isLive: boolean,
  organizador1: string,
  organizador2: string,
  tipo: string,
  ubicacion: string,
  ciudad: string,
  tagActuacion: string,
  coverImage: string
}

export type Interpretacion = {
  compositor?: string,
  idCompositor?: number,
  idInterpretacion: string,
  nMarcha?: number,
  time: Date,
  tituloMarcha?: string,
  ubicacion?: string
  latitude?: number
  longitude?: number
  url?: string
  enlazada: number
}

export type TipoActuacion = "Procesión" | "Concierto" | "Pasacalles"

export enum TIPOS_ACTUACIONES {
  PROCESION = 'Procesión',
  CONCIERTO = 'Concierto',
  PREGON = 'Pregón',
  PASACALLES = 'Pasacalles'
}

export enum TAG_ACTUACIONES {
  SEMANA_SANTA = 'Semana Santa',
  PROCESION_EXTRAORDINARIA = 'Procesión Extraordinaria',
  GLORIAS = 'Glorias'
}

type Generos = "Marcha de Procesión" | "Pasodoble" | "Pasacalles" | "Obra" | "Himno" | "Otros"

export type Composicion = {
  titulo: string,
  compositor: string,
  genero: Generos,
  anoComposicion: number,
  subtitulo: string,
  idComposicion: string,
  idCompositor: number,
  idCompositor2?: number,
  idFirebase?: string
}