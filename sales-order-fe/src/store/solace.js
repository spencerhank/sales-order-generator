import {ref} from 'vue';
import { defineStore } from 'pinia'
import solace, {MessageOutcome} from 'solclientjs'

export const useSolaceStore = defineStore('solaceStore', () => {
  const eventHandlers = ref({});
  
  
  let factorProps = new solace.SolclientFactoryProperties();
  factorProps.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factorProps);
  
  const solaceClient = {}
  solaceClient.session = null;
  solaceClient.eventConsumers = {}
  
  function connect() {
    if(solaceClient.session !== null) {
      console.log('Already connected and ready to subscribe')
    }
    
    try {
      solaceClient.session = solace.SolclientFactory.createSession({
        url: 'ws://localhost:8008',
        vpnName: 'default',
        userName: 'default',
        password: 'default'
      });
    } catch (error) {
      console.log(error)
    }
    
    solaceClient.session.on(solace.SessionEventCode.UP_NOTICE, function(sessionEvent) {
      console.log('=== Successfully connected and ready to subscribe. ===')
    });
    
    solaceClient.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
      console.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
    });
    solaceClient.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
      console.log('Disconnected.');
      solaceClient.subscribed = false;
      if (solaceClient.session !== null) {
        solaceClient.session.dispose();
        solaceClient.session = null;
      }
    });
    
    solaceClient.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, function (sessionEvent) {
      console.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
    });
//    For direct subscriptions
//    solaceClient.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, function (sessionEvent) {
//      if (solaceClient.subscribed) {
//        solaceClient.subscribed = false;
//        console.log('Successfully unsubscribed from topic: ' + sessionEvent.correlationKey);
//      } else {
//        solaceClient.subscribed = true;
//        console.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey);
//        console.log('=== Ready to receive messages. ===');
//      }
//    });
    // define message event listener
    solaceClient.session.on(solace.SessionEventCode.MESSAGE, function (message) {
//      console.log('Received message on topic: "' + message.getDestination().getName() + '", details:\n' +
//                message.dump());
//  For subscriptions only
//      for(const [topic, callback] of Object.entries(eventHandlers.value)) {
//        const regex = topic.replace('>', '.*')
//        let found = message.getDestination().getName().match(regex)
//        if(found) {
//          callback(message)
//        }
//      }
    });
    // connect the session
    try {
      solaceClient.session.connect();
    } catch (error) {
      console.log(error.toString());
    }
    
  }
  
//  function $reset() {
//    eventHandlers.value = {}
//    replyToTopic.value = ''
//    if($mqtt.status() === 'connected') {
//      $mqtt.unsubscribeAll();
//      const disconnectResult = $mqtt.disconnect();
//      console.log(disconnectResult);
//    }
//  }
//  
//  
//  function disconnect() {
//    if($mqtt.status() === 'connected') {
//      $mqtt.disconnect();
//    }
//
//  }
//

  function consume(queueName, responseHandler) {
//    Plugin doesn't current support + or #
    
    if (solaceClient.session !== null) {
      if (solaceClient.eventConsumers[queueName]) {
        console.log('Already consuming from "' + queueName
                    + '" and ready to receive messages.');
      } else {
        console.log('Consuming form Sales order queue: ' + queueName);
        try {
//          solaceClient.session.subscribe(
//            solace.SolclientFactory.createTopicDestination(subscriptionTopic),
//            true, // generate confirmation when subscription is added successfully
//            subscriptionTopic, // use topic name as correlation key
//            10000 // 10 seconds timeout for this operation
//            );
          let messageConsumer = solaceClient.session.createMessageConsumer({
            queueDescriptor: {name: queueName, type: solace.QueueType.QUEUE},
            acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
            createIfMissing: false,
            requiredSettlementOutcomes: [MessageOutcome.FAILED, MessageOutcome.REJECTED]
          })
          messageConsumer.on(solace.MessageConsumerEventName.UP, function () {
            messageConsumer.consuming = true;
            console.log('=== Ready to receive messages. ===');
          });
          messageConsumer.on(solace.MessageConsumerEventName.CONNECT_FAILED_ERROR, function () {
            messageConsumer.consuming = false;
            console.log('=== Error: the message consumer could not bind to queue "' + queueName +
                            '" ===\n   Ensure this queue exists on the message router vpn');
            messageConsumer.exit();
          });
          messageConsumer.on(solace.MessageConsumerEventName.DOWN, function () {
            messageConsumer.consuming = false;
            console.log('=== The message consumer is now down ===');
          });
          messageConsumer.on(solace.MessageConsumerEventName.DOWN_ERROR, function () {
            messageConsumer.consuming = false;
            console.log('=== An error happened, the message consumer is down ===');
          });
          messageConsumer.on(solace.MessageConsumerEventName.MESSAGE, function (message) {
            try {
              responseHandler(message)
            } catch(error) {
              message.settle(MessageOutcome.REJECTED)
            }



          });
          messageConsumer.connect()
          solaceClient.eventConsumers[queueName] = messageConsumer
        } catch (error) {
          console.log(error.toString());
        }
      }
    } else {
      console.log('Cannot subscribe because not connected to Solace PubSub+ Event Broker.');
    }
  }
  function stopConsume(queueName) {
    if (solaceClient.session !== null) {
      if (solaceClient.eventConsumers[queueName] && solaceClient.eventConsumers[queueName].consuming) {
        solaceClient.eventConsumers[queueName].consuming = false;
        console.log('Disconnecting consumption from queue: ' + queueName);
        try {
          solaceClient.eventConsumers[queueName].disconnect();
          solaceClient.eventConsumers[queueName].dispose();
          delete solaceClient.eventConsumers[queueName]
        } catch (error) {
          console.log(error.toString());
        }
      } else {
        console.log('Cannot disconnect the consumer because it is not connected to queue "' +
                    queueName + '"');
      }
    } else {
      console.log('Cannot disconnect the consumer because not connected to Solace PubSub+ Event Broker.');
    }
    
  }
  
  return {
    connect,
    consume,
    stopConsume,
    eventHandlers}
})