/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import {createPahoMqttPlugin} from 'vue-paho-mqtt';

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
      .use(createPahoMqttPlugin({
        PluginOptions: {
          autoConnect: false,
          showNotifications: false
        },
        MqttOptions: {
          host:'localhost',
          port: 8009,
          clientId: `test-id-${Math.random()*99}`,
          username:'default',
          password:'default',
          useSSL:false,
          enableMainTopic:false
        }
      }))
}
