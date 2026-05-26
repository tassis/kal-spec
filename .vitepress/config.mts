import { defineConfig } from 'vitepress'
import { kdlLanguage } from './kdl-language'

const v001Sections = [
  { text: 'Preface', link: '/versions/v0.0.1/sections/preface' },
  { text: '01 Overview', link: '/versions/v0.0.1/sections/01-overview' },
  { text: '02 Core Design Principles', link: '/versions/v0.0.1/sections/02-core-design-principles' },
  { text: '03 Vocabulary', link: '/versions/v0.0.1/sections/03-vocabulary' },
  { text: '04 Document Model', link: '/versions/v0.0.1/sections/04-document-model' },
  { text: '05 Header Sections', link: '/versions/v0.0.1/sections/05-header-sections' },
  { text: '06 Scope Model', link: '/versions/v0.0.1/sections/06-scope-model' },
  { text: '07 Component Model', link: '/versions/v0.0.1/sections/07-component-model' },
  { text: '08 Composition Rules', link: '/versions/v0.0.1/sections/08-composition-rules' },
  { text: '09 Host-Resolved References', link: '/versions/v0.0.1/sections/09-host-resolved-references' },
  { text: '10 Reference Model', link: '/versions/v0.0.1/sections/10-reference-model' },
  { text: '11 String and Interpolation Model', link: '/versions/v0.0.1/sections/11-string-and-interpolation-model' },
  { text: '12 Operator Model', link: '/versions/v0.0.1/sections/12-operator-model' },
  { text: '13 Operator Contract', link: '/versions/v0.0.1/sections/13-operator-contract' },
  { text: '14 Capture Model', link: '/versions/v0.0.1/sections/14-capture-model' },
  { text: '15 Guard Model', link: '/versions/v0.0.1/sections/15-guard-model' },
  { text: '16 core.use', link: '/versions/v0.0.1/sections/16-core-use' },
  { text: '17 core.splice', link: '/versions/v0.0.1/sections/17-core-splice' },
  { text: '18 core.each', link: '/versions/v0.0.1/sections/18-core-each' },
  { text: '19 core.assign', link: '/versions/v0.0.1/sections/19-core-assign' },
  { text: '20 core.load_vars', link: '/versions/v0.0.1/sections/20-core-load-vars' },
  { text: '21 Core Execution Order', link: '/versions/v0.0.1/sections/21-core-execution-order' },
  { text: '22 Validation Model', link: '/versions/v0.0.1/sections/22-validation-model' },
  { text: '23 Structured Runtime Values and Inline Literals', link: '/versions/v0.0.1/sections/23-structured-runtime-values-and-inline-literals' },
  { text: '24 Current Core Model Summary', link: '/versions/v0.0.1/sections/24-current-core-model-summary' },
  { text: '25 Open Questions', link: '/versions/v0.0.1/sections/25-open-questions' },
  { text: '26 Host and Runtime Boundary', link: '/versions/v0.0.1/sections/26-host-and-runtime-boundary' },
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
