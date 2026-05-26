import { defineConfig } from 'vitepress'
import { kdlLanguage } from './kdl-language'

const v001Sections = [
  { text: 'Preface', link: '/versions/v0.0.1/sections/preface' },
  { text: '00 Overview', link: '/versions/v0.0.1/sections/00-overview' },
  { text: '01 Core Design Principles', link: '/versions/v0.0.1/sections/01-core-design-principles' },
  { text: '02 Vocabulary', link: '/versions/v0.0.1/sections/02-vocabulary' },
  { text: '03 Document Model', link: '/versions/v0.0.1/sections/03-document-model' },
  { text: '04 Header Sections', link: '/versions/v0.0.1/sections/04-header-sections' },
  { text: '05 Scope Model', link: '/versions/v0.0.1/sections/05-scope-model' },
  { text: '06 Component Model', link: '/versions/v0.0.1/sections/06-component-model' },
  { text: '07 Composition Rules', link: '/versions/v0.0.1/sections/07-composition-rules' },
  { text: '08 Host-Resolved References', link: '/versions/v0.0.1/sections/08-host-resolved-references' },
  { text: '09 Reference Model', link: '/versions/v0.0.1/sections/09-reference-model' },
  { text: '10 String and Interpolation Model', link: '/versions/v0.0.1/sections/10-string-and-interpolation-model' },
  { text: '11 Operator Model', link: '/versions/v0.0.1/sections/11-operator-model' },
  { text: '12 Operator Contract', link: '/versions/v0.0.1/sections/12-operator-contract' },
  { text: '13 Capture Model', link: '/versions/v0.0.1/sections/13-capture-model' },
  { text: '14 Guard Model', link: '/versions/v0.0.1/sections/14-guard-model' },
  { text: '15 core.use', link: '/versions/v0.0.1/sections/15-core-use' },
  { text: '16 core.splice', link: '/versions/v0.0.1/sections/16-core-splice' },
  { text: '17 core.each', link: '/versions/v0.0.1/sections/17-core-each' },
  { text: '18 core.assign', link: '/versions/v0.0.1/sections/18-core-assign' },
  { text: '19 core.load_vars', link: '/versions/v0.0.1/sections/19-core-load-vars' },
  { text: '20 Core Execution Order', link: '/versions/v0.0.1/sections/20-core-execution-order' },
  { text: '21 Validation Model', link: '/versions/v0.0.1/sections/21-validation-model' },
  { text: '22 Structured Runtime Values and Inline Literals', link: '/versions/v0.0.1/sections/22-structured-runtime-values-and-inline-literals' },
  { text: '23 Current Core Model Summary', link: '/versions/v0.0.1/sections/23-current-core-model-summary' },
  { text: '24 Open Questions', link: '/versions/v0.0.1/sections/24-open-questions' },
]

export default defineConfig({
  title: 'KAL Specification',
  description: 'Versioned drafts of the KAL language specification.',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    languages: [kdlLanguage],
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'v0.0.1', link: '/versions/v0.0.1/' },
      { text: 'Sections', link: '/versions/v0.0.1/sections/' },
    ],
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
    },
    sidebar: {
      '/versions/v0.0.1/': [
        {
          text: 'v0.0.1',
          items: [
            { text: 'Index', link: '/versions/v0.0.1/' },
            { text: 'All-in-One', link: '/versions/v0.0.1/all' },
            { text: 'Sections Index', link: '/versions/v0.0.1/sections/' },
          ],
        },
        {
          text: 'Sections',
          items: v001Sections,
        },
      ],
      '/versions/': [
        {
          text: 'Versions',
          items: [
            { text: 'Version Index', link: '/versions/v0.0.1/' },
            { text: 'All-in-One', link: '/versions/v0.0.1/all' },
            { text: 'Sections Index', link: '/versions/v0.0.1/sections/' },
          ],
        },
        {
          text: 'Sections',
          items: v001Sections,
        },
      ],
    },
    footer: {
      message: 'KAL core language specification drafts.',
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#0f172a' }],
  ],
})
