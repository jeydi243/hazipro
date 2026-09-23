import type { AvatarProps } from "@nuxt/ui";
import type { Lookup, Organisation } from "./organisation";

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
    categorie_id: string | Lookup;
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
    user_id: string;
    nom?: string;
    email?: string;
    niveau: number;
    org_id: string | Organisation;
    date_debut: string | Date;
    date_fin: string | Date;
    date_taux: string;
    status: string;
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

export interface Notification {
    id: number;
    unread?: boolean;
    sender: User;
    body: string;
    date: string;
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
