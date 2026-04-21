import { defineField, defineType } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Shop-Produkt',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Preis (€)',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Produktbild',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'buyLink',
      title: 'Kaufen-Link',
      type: 'url',
      description: 'Link zum Etsy-Shop, Shopify etc.',
    }),
    defineField({
      name: 'available',
      title: 'Verfügbar',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'edition',
      title: 'Edition',
      type: 'string',
      description: 'z.B. "Limited Edition 1/50"',
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', subtitle: 'price' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle ? `€ ${subtitle}` : 'Kein Preis' }
    },
  },
  orderings: [
    { title: 'Reihenfolge', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
