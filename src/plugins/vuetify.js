import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#264653',
        secondary: '#2a9d8f',
        tertiary: '#1B343A',
        accent: '#EDFCFF',
        gradient: ['#BEFFFD', '#ACFFE9', '#B2FFC6', '#CFFF9B', '#F9F871'],
        gradient2: ['#6AD4C5', '#F77EEC', '#C3FCF2'],
        price: '#9D2A37',
        bronze: '#b08d57',
        gold: '#d4af37',
        silver: '#aaa9ad',
        error: '#b71c1c',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
      dark: {
        primary: '#264653',
        secondary: '#2a9d8f',
        tertiary: '#1B343A',
        accent: '#DCF9FF',
        price: '#2A5E9D',
        bronze: '#b08d57',
        gold: '#d4af37',
        silver: '#aaa9ad',
        error: '#b71c1c',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
})
