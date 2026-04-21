import { defineField, defineType } from 'sanity'

export const shopTeaserSchema = defineType({
  name: 'shopTeaser',
  title: 'Shop Teaser Bilder',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'Name des Prints (wird als Alt-Text verwendet)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-Text',
          type: 'string',
          description: 'Beschreibung für Barrierefreiheit und SEO',
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Die drei Bilder mit den niedrigsten Nummern werden auf der Startseite angezeigt.',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', order: 'order' },
    prepare({ title, media, order }) {
      return {
        title: `${order ? `${order}. ` : ''}${title ?? '—'}`,
        media,
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
