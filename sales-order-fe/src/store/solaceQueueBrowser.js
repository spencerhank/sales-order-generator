import {ref} from 'vue';
import { defineStore } from 'pinia'
import solace from 'solclientjs'

export const useSolaceQueueBrowserStore = defineStore('solaceQueueBrowserStore', () => {
  const eventHandlers = ref({});


  let factorProps = new solace.SolclientFactoryProperties();
  factorProps.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factorProps);

  const solaceClient = {}
  solaceClient.session = null;
  solaceClient.queueBrowsers = {}

  function connect() {
    if(solaceClient.session !== null) {
      console.log('Already connected and ready to subscribe')
    }

    try {
      solaceClient.session = solace.SolclientFactory.createSession({
        //        url: 'wss://mr-connection-uyu0ef5l9p0.messaging.solace.cloud:443',
//        vpnName: 'hank-uat-broker',
//        userName: 'solace-cloud-client',
        //        password: 'o3srlek9ttu7bqmledj1us3jbt'
        url: 'wss://mr-connection-ndqyaz1q7en.messaging.solace.cloud:443',
        vpnName: 'hank-qa-broker',
        userName: 'solace-cloud-client',
        password: 'bligldmlg29t5hfj33dhp6q7l3'
      });
    } catch (error) {
      console.log(error)
    }
    solaceClient.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
      console.log('Connection failed to the broker: ' + sessionEvent.infoStr +
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
    // define message event listener
    // connect the session
    try {
      solaceClient.session.connect();
    } catch (error) {
      console.log(error.toString());
    }

  }
  function browse(queueName, responseHandler) {
    if (solaceClient.session !== null) {
      if (solaceClient.queueBrowsers[queueName] && solaceClient.queueBrowsers[queueName]) {
        console.log('Already consuming from "' + queueName
                    + '" and ready to receive messages.');
      } else {
        console.log('Consuming form Sales order queue: ' + queueName);
        try {

          let queueBrowser = solaceClient.session.createQueueBrowser({
            queueDescriptor: {name: queueName, type: solace.QueueType.QUEUE},
          })
          queueBrowser.on(solace.QueueBrowserEventName.UP, function () {
            queueBrowser.connected = true;
            console.log('=== Ready to receive messages. ===');
          });
          queueBrowser.on(solace.QueueBrowserEventName.CONNECT_FAILED_ERROR, function () {
            queueBrowser.connected = false;
            console.log('=== Error: the message browser could not bind to queue "' + queueName +
                            '" ===  Ensure this queue exists on the broker vpn');
            queueBrowser.disconnect()
          });

          queueBrowser.on(solace.QueueBrowserEventName.DOWN, function () {
            queueBrowser.consuming = false;
            console.log('=== The message consumer is now down ===');
          });
          queueBrowser.on(solace.QueueBrowserEventName.DOWN_ERROR, function () {
            queueBrowser.consuming = false;
            console.log('=== An error happened, the message consumer is down ===');
          });
          queueBrowser.on(solace.QueueBrowserEventName.GM_DISABLED, function () {
            console.log('=== An error happened, the message browser is GM_DISABLED ===');
          });
          queueBrowser.on(solace.QueueBrowserEventName.MESSAGE, function (message) {
            responseHandler(message)
          });
          queueBrowser.connect()
          queueBrowser.consuming = true
          solaceClient.queueBrowsers[queueName] = queueBrowser
          eventHandlers.value[queueName] = queueName
        } catch (error) {
          console.log(error.toString());
        }
      }
    } else {
      console.log('Cannot subscribe because not connected to Solace PubSub+ Event Broker.');
    }
  }
  function stopBrowse(queueName) {
    if (solaceClient.session !== null) {
      if (solaceClient.queueBrowsers[queueName] && solaceClient.queueBrowsers[queueName].consuming) {
        solaceClient.queueBrowsers[queueName].consuming = false;
        console.log('Disconnecting consumption from queue: ' + queueName);
        try {
          solaceClient.queueBrowsers[queueName].disconnect();
          delete solaceClient.queueBrowsers[queueName]
          delete eventHandlers.value[queueName]
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

  function publishUpdatedMessage(salesOrder, topic) {
    let message = solace.SolclientFactory.createMessage();
    message.setDestination(solace.SolclientFactory.createTopicDestination(topic));
    message.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING,salesOrder));
//    message.setBinaryAttachment(salesOrder);
    message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

    message.setDMQEligible(true);
    solaceClient.session.send(message)
  }

  function removeMessageFromDmQ(queueName, message) {
  solaceClient.queueBrowsers[queueName].removeMessageFromQueue(message)
}

  return {
    connect,
    browse,
    stopBrowse,
    publishUpdatedMessage,
    removeMessageFromDmQ,
    eventHandlers}
  })