import { defineField, defineType } from 'sanity'

export const galleryImageSchema = defineType({
  name: 'galleryImage',
  title: 'Galerie-Bild',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt-Text',
      type: 'string',
      description: 'Kurze Bildbeschreibung für Screenreader und SEO',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Portrait', value: 'portrait' },
          { title: 'Landschaft', value: 'landscape' },
          { title: 'Event', value: 'event' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Sonstiges', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Kleinere Zahl = weiter vorne',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      description: 'Auf der Startseite anzeigen (max. 5 Bilder)',
      initialValue: false,
    }),
    defineField({
      name: 'animated',
      title: 'Cinemagraph-Effekt',
      type: 'boolean',
      description: 'Aktiviert subtilen Atem-Effekt — nur für 2–3 Highlight-Bilder verwenden',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', subtitle: 'category' },
  },
  orderings: [
    { title: 'Reihenfolge', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
