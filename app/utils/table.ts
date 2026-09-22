import type { ComponentProps } from 'vue-component-type-helpers'
import type { UTable } from '#components'

export type TableUi = ComponentProps<typeof UTable>['ui']

// Table standalone d'une page CRUD : bordures arrondies, header subtil,
// paddings compacts, chiffres tabulaires (alignement des montants/codes).
export const haziTableUi: TableUi = {
    base: 'w-full table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-lg',
    thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
    tbody: '[&>tr]:last:[&>td]:border-b-0',
    th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r pl-2',
    td: 'border-b border-(--ui-border) p-2 tabular-nums',
}

// Table embarquée dans un tiroir de détails : mêmes réglages,
// coins supérieurs seuls arrondis.
export const haziTableUiEmbedded: TableUi = {
    ...haziTableUi,
    base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
    th: 'py-1 border-y border-(--ui-border) first:border-l last:border-r pl-2',
}
