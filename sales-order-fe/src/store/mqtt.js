import {ref} from 'vue';
import { defineStore } from 'pinia'
import {$mqtt} from 'vue-paho-mqtt';
import {v4 as uuidv4} from 'uuid';
import {useSalesOrderStore} from "@/store/salesOrderStore";

export const useMqttStore = defineStore('mqttStore', () => {
  const eventHandlers = ref({});
  const replyToTopic = ref('');
  const salesOrderStore = useSalesOrderStore();
  
  function $reset() {
    eventHandlers.value = {}
    replyToTopic.value = ''
    if($mqtt.status() === 'connected') {
      $mqtt.unsubscribeAll();
      const disconnectResult = $mqtt.disconnect();
      console.log(disconnectResult);
    }
  }
  
  function login() {
    if($mqtt.status() !== 'connected') {
      $mqtt.connect({
         onMessageArrived: (message) => {
//           salesOrderStore.addNewSalesOrders(message);
           for(const [topic, callback] of Object.entries(eventHandlers.value)) {
               const regex = topic.replace('#', '.*')
             let found = message.destinationName.match(regex);
               if(found) {
                 callback(message)
               }
             } 
             // console.log(eventHandlers.value);
         }
      });

      // set up replyToTopic
      $mqtt.subscribe('$SYS/client/reply-to', data => {
        replyToTopic.value = data
        subscribeToReplyToTopic()                
      })

    }
  }
  
  function disconnect() {
    if($mqtt.status() === 'connected') {
      $mqtt.disconnect();
    }

  }

  function subscribeToReplyToTopic() {
    if(replyToTopic.value !== '') {
      $mqtt.subscribe(replyToTopic.value, data => {
        let response = JSON.parse(data);

        if(response.correlationId) {
          // console.log(response.correlationId.split(';')[0]);
          // console.log(response)
          eventHandlers.value[response.correlationId.split(':')[0]](response.message);
        }

        // console.log('response from replyto topic: ' +response);
      }, false)
    }
  }
  function publishMessage(messageTopic, payload) {
    let requestObject = {
      "correlationId": `${messageTopic}:${uuidv4()}`,
      'message': payload
    }
    $mqtt.publish(messageTopic, JSON.stringify(requestObject), 'B')
  }

  function addRequestHandler(requestTopic, requestPayload, responseHandler) {
    // add response handler to list of event handlers
    eventHandlers.value[requestTopic] = responseHandler;
    // create request object
    let requestObject = {
      "correlationId": `${requestTopic}:${uuidv4()}`,
      "replyTo": replyToTopic.value,
      'message': requestPayload
    }
    $mqtt.publish(requestTopic, JSON.stringify(requestObject), 'B')
  }

  function addSubscriptionHandler(subscriptionTopic, responseHandler) {
//    Plugin doesn't current support + or #
    eventHandlers.value[subscriptionTopic] = responseHandler
    $mqtt.subscribe(subscriptionTopic, responseHandler)
  }

  function removeSubscriptionHandler(subscriptionTopic) {
    $mqtt.unsubscribe(subscriptionTopic)
  }
  
  return {
    $reset,
    login,
    disconnect,
    addRequestHandler,
    publishMessage,
    addSubscriptionHandler,
    removeSubscriptionHandler,
    replyToTopic,
    eventHandlers}
})