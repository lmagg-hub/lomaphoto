import { defineField, defineType, defineArrayMember } from 'sanity'

export const shopProductSchema = defineType({
  name: 'shopProduct',
  title: 'Shop-Produkt (Print)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt-Text', type: 'string' }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'mockupImages',
      title: 'Mockup-Bilder (max. 3)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt-Text', type: 'string' }),
          ],
        }),
      ],
      validation: (R) => R.max(3),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Fett', value: 'strong' },
              { title: 'Kursiv', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'sizes',
      title: 'Größen & Preise',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'size',
              title: 'Größe',
              type: 'string',
              options: {
                list: [
                  { title: '30 × 20 cm', value: '30 × 20 cm' },
                  { title: '60 × 40 cm', value: '60 × 40 cm' },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'price',
              title: 'Preis (€)',
              type: 'number',
              validation: (R) => R.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'size', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `€ ${subtitle}` : '' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Verfügbar',
      type: 'boolean',
      initialValue: true,
      description: 'Deaktivieren um das Produkt aus dem Shop zu nehmen',
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Homepage Teaser)',
      type: 'boolean',
      initialValue: false,
      description: 'Auf der Startseite anzeigen',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'available' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle ? 'Verfügbar' : 'Nicht verfügbar' }
    },
  },
})
