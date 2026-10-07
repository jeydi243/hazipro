import type { AvatarProps } from "@nuxt/ui";
import type { Lookup, Matrice, Organisation } from "./organisation";
import type { Profil } from "./auth";

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";
export type SaleStatus = "paid" | "failed" | "refunded";
export type Period = "daily" | "weekly" | "monthly";

export interface User {
    id: number;
    nom: string;
    email: string;
    avatar?: AvatarProps;
    status: UserStatus;
    location: string;
}

export interface Range {
    start: Date;
    end: Date;
}

export interface Mail {
    id: number;
    unread?: boolean;
    from: User;
    subject: string;
    body: string;
    date: string;
}
export interface Beneficiaire {
    id: string;
    nom: string;
    postnom: string;
    prenom: string;
    code: string;
    genre: string;
    status: string;
    created: string | Date;
    updated: string | Date;
    approbateur_id: string | Profil;
    categorie_id: string | Lookup;
}
export interface Adresse {
    id: string;
    beneficiaire_id: string | Beneficiaire;
    adresse: string;
    ville: string;
    pays: string;
    status: string;
    created: string | Date;
    updated: string | Date;
}
export interface Banque {
    id: string;
    nom: string;
    code: string;
    description: string;
    status: string;
    created: string | Date;
    updated: string | Date;
}
export interface CompteBancaire {
    id: string;
    beneficiaire_id: string | Beneficiaire;
    numero_compte: string | number;
    intitule_compte: string;
    banque_id: string | Banque;
    agence?: string;
    rib?: string;
    devise: string;

    status: string;
    created: string | Date;
    updated: string | Date;
    matrice_id: string | Matrice;
    approbateur_id: string | Profil;
}
export interface Taux {
    id: string;
    from_currency: string;
    to_currency: string;
    valeur: number;
    date_taux: string;
}
export interface Approbateur {
    id: string;
    matrice_id: string;
    user_id: string | Profil;
    status: string;
    niveau: number;
    date_debut: string | Date;
    date_fin?: string | Date;
    org_id: string | Organisation;
    type_beneficiaire: string | Lookup;
    date_taux: string;
}
export interface NF {
    id: string;
    organisation_id: string | Organisation;
    devise: string;
    description: string;
    nature_nf: string | Lookup;
    beneficiaire_id: string | Beneficiaire;
    created_at: string;
    updated_at: string;
    groupe_paiement_id: string;
    type_nf: string;
    date_document: string;
}

export interface Member {
    nom: string;
    username: string;
    role: "member" | "owner";
    // avatar: Avatar;
}

export interface Notification {
    id: number;
    unread?: boolean;
    sender: User;
    body: string;
    date: string;
}

export interface Sale {
    id: string;
    date: string;
    status: SaleStatus;
    email: string;
    amount: number;
}

export interface Stat {
    title: string;
    icon: string;
    value: number | string;
    variation: number;
    formatter?: (value: number) => string;
}

export type {
    Medecin,
    Mutuelle,
    Patient,
    PatientListeAttente,
    PatientMutuelle,
    PatientOrg,
    RendezVous,
} from "./patient";
export type { Classe, Lookup, Organisation } from "./organisation";
export type { Facture, Tarifaire, TarifaireLine } from "./facture";
export type { Client, Fournisseur } from "./client";
export type {
    Article,
    ArticleAffectation,
    STKHeader,
    STKLine,
    STKLineDetail,
    Stock,
} from "./stock";
export type { Affectation, Owner, Profil, Role, UserRole } from "./auth";
