export interface Classe {
    id: string
    table_name: string
    description: string
    code: string
    nom: string
    status: string
    created_at: string
    updated_at: string
    date_debut: Date
    end_date: Date
}
export interface NF {
    id: string
    organisation_id: string
    description: string
    nature_nf: string
    devise: string
    beneficiaire_id: string
    created_at: string
    updated_at: string
    update: Date
}

export interface Lookup {
    id: string
    nom: string
    classe: Classe
    classe_id: string
    code: string
    description: string
}
export interface Matrice {
    id: string
    nom: string
    classe: Classe
    code: string
    description: string
    type_document_id: string
    status: string
}

export interface Organisation {
    id: string
    nom: string
    description?: string
    code?: string
    type?: Lookup
    status?: string
    prefixe?: string
    type_organisation_id: Lookup | string
    organisation_parent?: Organisation
    organisation_parent_id?: string
}
