import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero-Titel',
      type: 'string',
      initialValue: 'Lorenz Magg',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero-Untertitel',
      type: 'string',
      initialValue: 'Photography & Videography',
    }),
    defineField({
      name: 'email',
      title: 'Kontakt-E-Mail',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram-URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube-URL',
      type: 'url',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo-URL',
      type: 'url',
    }),
    defineField({
      name: 'location',
      title: 'Standort',
      type: 'string',
      initialValue: 'Österreich',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Website-Einstellungen' }
    },
  },
})
