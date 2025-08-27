export interface IMember {
    id: number;
    nombre: string;
    cedula: string;
    telefono: string;
    email: string;
    direccion: string;
    sector: string;
    fecha_ingreso: Date;
    estado: boolean;
    comite: number;
    rol: number;
}