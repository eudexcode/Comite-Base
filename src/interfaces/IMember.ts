export interface IMember {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    direccion: string;
    sector: string;
    fecha_ingreso: Date;
    activo: boolean;
    comite_id: number;
    rol_id: number;
}