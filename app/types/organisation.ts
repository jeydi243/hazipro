import type { Approbateur, Beneficiaire, Profil } from ".";

export interface Classe {
    id: string;
    table_name: string;
    description: string;
    code: string;
    nom: string;
    status: string;
    created_at: string;
    updated_at: string;
    date_debut: Date;
    end_date: Date;
}

export interface HistoriqueApprobation {
    id: string;
    nf_id: string | NF;
    approbateur_id: string | Approbateur;
    statut: string;
    date_approbation: Date | string;
    date_soumission: Date | string;
}
export interface NF {
    id: string;
    organisation_id: string;
    description: string;
    numero_document: string;
    nature_nf: string;
    devise_id: string | Lookup;
    montant_total: number;
    date_document: string | Date;
    beneficiaire_id: string | Beneficiaire;
    created_at: string;
    updated_at: string;
    update: Date;
    statut_approbation: string;
    statut_paiement: string;
    statut_document: string;
}
export interface LigneNF {
    id: string;
    frais_id: string;
    montant_total: number;
    devise_id: string | Lookup;
    description: string;
    nf_id: string | NF;
}

export interface Lookup {
    id: string;
    nom: string;
    classe: Classe;
    classe_id: string;
    code: string;
    description: string;
}
export interface Matrice {
    id: string;
    nom: string;
    classe: Classe;
    code: string;
    description: string;
    type_document_id?: string;
    date_debut: string | Date;
    status: string;
}

export interface Organisation {
    id: string;
    nom: string;
    description?: string;
    code?: string;
    type?: Lookup;
    status?: string;
    prefixe?: string;
    type_organisation_id: Lookup | string;
    organisation_parent?: Organisation;
    organisation_parent_id?: string;
}
