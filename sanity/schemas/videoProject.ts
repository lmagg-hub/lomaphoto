import { defineField, defineType } from 'sanity'

export const videoProjectSchema = defineType({
  name: 'videoProject',
  title: 'Videoprojekt',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Reihenfolge auf der Homepage (1 = Hauptvideo, 2, 3… = Karussell)',
      validation: (R) => R.required().min(1),
      initialValue: 99,
    }),
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
      name: 'videoUrl',
      title: 'Video-URL',
      type: 'url',
      description: 'YouTube- oder Vimeo-Link',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Vorschaubild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Showreel', value: 'showreel' },
          { title: 'Wedding', value: 'wedding' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Music Video', value: 'music' },
          { title: 'Documentary', value: 'documentary' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Hervorgehoben',
      type: 'boolean',
      description: 'Als Hauptvideo anzeigen',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'thumbnail', subtitle: 'category' },
  },
})
