import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'lomaphoto',
  title: 'lomaphoto Studio',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalt')
          .items([
            S.listItem()
              .title('Website-Einstellungen')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Über mich')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
              ),
            S.divider(),
            S.documentTypeListItem('galleryImage').title('Galerie'),
            S.documentTypeListItem('videoProject').title('Videoprojekte'),
            S.documentTypeListItem('product').title('Shop-Produkte'),
            S.documentTypeListItem('shopTeaser').title('Shop Teaser Bilder'),
            S.divider(),
            S.documentTypeListItem('clientTicker').title('Clients'),
          ]),
    }),
  ],

  schema: { types: schemaTypes },
})
