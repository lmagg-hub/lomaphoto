import { defineField, defineType } from 'sanity'

const SECTION_TITLES: Record<string, string> = {
  hero:        'Hero Video',
  gallery:     'Galerie',
  videography: 'Videografie',
  clients:     'Client Ticker',
  shop:        'Shop Teaser',
  about:       'Über mich',
  contact:     'Kontakt',
}

export const homepageSettingsSchema = defineType({
  name: 'homepageSettings',
  title: 'Homepage Einstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionOrder',
      title: 'Abschnitt-Reihenfolge',
      type: 'array',
      description: 'Ziehe die Abschnitte in die gewünschte Reihenfolge. Deaktiviere einzelne um sie zu verstecken.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'section',
              title: 'Abschnitt',
              type: 'string',
              options: {
                list: [
                  { title: 'Hero Video',     value: 'hero' },
                  { title: 'Galerie',        value: 'gallery' },
                  { title: 'Videografie',    value: 'videography' },
                  { title: 'Client Ticker',  value: 'clients' },
                  { title: 'Shop Teaser',    value: 'shop' },
                  { title: 'Über mich',      value: 'about' },
                  { title: 'Kontakt',        value: 'contact' },
                ],
              },
              validation: R => R.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Aktiv',
              type: 'boolean',
              description: 'Abschnitt auf der Homepage anzeigen',
              initialValue: true,
            }),
          ],
          preview: {
            select: { section: 'section', enabled: 'enabled' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(value: any) {
              const { section, enabled } = value as { section: string; enabled: boolean }
              return {
                title:    SECTION_TITLES[section] ?? section,
                subtitle: enabled ? '✓ Aktiv' : '✗ Deaktiviert',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage Einstellungen' }),
  },
})
