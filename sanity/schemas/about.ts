import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'Über mich',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biografie',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
          ],
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
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageAlt',
      title: 'Alt-Text Foto',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Über mich' }
    },
  },
})
