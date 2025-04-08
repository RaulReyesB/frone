export interface Login {
    user_name: string,
    password: string
}
export interface User {
    name: string,
    last_name: string,
    type_user: string,
    user_name: string,
    email: string,
    password: string,
    phone_number: string,
    status: string,
    registration_date: Date,
    update_date: Date
}
export interface UserID {
    id: number,
    name: string,
    last_name: string,
    type_user: string,
    user_name: string,
    email: string,
    password: string,
    phone_number: string,
    status: string,
    registration_date: Date,
    update_date: Date
}
export interface UpdUser {
    name: string,
    last_name: string,
    type_user: string,
    user_name: string,
    email: string,
    password: string,
    phone_number: string,
    status: string,
    update_date: Date
}
export interface Material {
    ID_Material: number,
    material_type: string,
    brand: string,
    model: string,
    state: string,
}
export interface NoIDMaterial {
    material_type: string,
    brand: string,
    model: string,
    state: string,
}
export interface Loan {
    ID_Loan: number,
    id_user: number,
    id_material: number,
    loan_date: Date,
    return_date: Date,
    status: string,
}
export interface NoIDLoan {
    id_user: number,
    id_material: number,
    loan_date: Date,
    return_date: Date,
    status: string,
}