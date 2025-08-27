export interface IComite {
    id: number;
    nombre: string;
    zona: string;
    direccion: string;
    secretario: number;
    telefono: string;
    email: string;
    fecha_creacion: Date;
    activo: boolean;
}