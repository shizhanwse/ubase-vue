import { debug, production } from './helpers/getArg'
import fs from 'fs'
import {getItem} from './localStorage'

var userConfig = JSON.parse(getItem('userConfig'))

export default {
  vueEntryConfig:{
    src: './src',
    vueLibBuildIn:true,
    components: './src/components',
    pages: './src/pages',
    rem: userConfig.rem,
    langs:userConfig.langs,
    autoImportVueComponent:userConfig.autoImportVueComponent,
    exportName: 'Ubase'
  },

  rem: userConfig.rem,
  alias:userConfig.alias || {},
  proxy:userConfig.proxy||[],
  src: './src',
  dest: userConfig.dist || './dist',
  app: '/app',

  assets: {
    images: 'statics/images',
    scripts: 'statics/scripts',
    styles: 'statics/styles',
    fonts: 'statics/fonts',
  },

  isProduction: production,
  isDeveloper: !production,
  isDebug: debug,
  NODE_ENV: production ? 'production' : 'developer',

  server: {
    port: userConfig.port || 8081,
  },
}
