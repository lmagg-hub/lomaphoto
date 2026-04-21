import { defineField, defineType } from 'sanity'

export const clientTickerSchema = defineType({
  name: 'clientTicker',
  title: 'Clients',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Firmenname',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fontStyle',
      title: 'Schriftart',
      type: 'string',
      options: {
        list: [
          { title: 'Roboto — Modern Sans',          value: 'Roboto' },
          { title: 'Playfair Display — Elegant Serif', value: 'Playfair Display' },
          { title: 'Montserrat — Clean Modern',     value: 'Montserrat' },
          { title: 'Oswald — Bold Condensed',       value: 'Oswald' },
          { title: 'Cormorant Garamond — Luxury Serif', value: 'Cormorant Garamond' },
          { title: 'Open Sans — Friendly Sans',     value: 'Open Sans' },
          { title: 'Arial — Corporate Sans',        value: 'Arial' },
        ],
        layout: 'radio',
      },
      initialValue: 'Roboto',
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'active',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Deaktivieren um den Eintrag im Ticker auszublenden ohne ihn zu löschen.',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'companyName', subtitle: 'fontStyle', active: 'active', order: 'order' },
    prepare({ title, subtitle, active, order }) {
      return {
        title: `${order ? `${order}. ` : ''}${title ?? '—'}`,
        subtitle: `${subtitle ?? ''} ${active === false ? '· inaktiv' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Reihenfolge',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
