import { defineField, defineType } from 'sanity'

export const heroVideosSchema = defineType({
  name: 'heroVideos',
  title: 'Hero Videos',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal name for this video collection',
    }),
    defineField({
      name: 'videos',
      title: 'Video Pool',
      type: 'array',
      description: 'Upload MP4/WebM files (under 5 MB each). One is picked randomly per session.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'video',
              title: 'Video File',
              type: 'file',
              options: { accept: 'video/mp4,video/webm' },
            }),
            defineField({
              name: 'name',
              title: 'Video Name',
              type: 'string',
              description: 'Optional: internal label for this clip',
            }),
          ],
          preview: {
            select: { title: 'name' },
            prepare: ({ title }: { title?: string }) => ({
              title: title || 'Unnamed video',
            }),
          },
        },
      ],
      validation: R => R.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Hero Videos',
    }),
  },
})
