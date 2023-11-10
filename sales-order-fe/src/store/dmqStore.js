import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {useSolaceQueueBrowserStore} from "@/store/solaceQueueBrowser";

export const useDmqStore = defineStore('dmqStore', () => {

  const queueBrowserStore = useSolaceQueueBrowserStore();
  queueBrowserStore.connect()
  
  const dmqOrders = ref([]);
  const selectedDmqOrder = ref(null)
  
  const queueName = '#sales_order_dmq_queue'

  function listenForDmqOrders() {
    if(queueBrowserStore.eventHandlers[queueName]) {
      console.log('Already connected')
    } else {
      dmqOrders.value = []
      queueBrowserStore.browse(queueName, retrieveSalesOrders)  
    }
    
  }
  
  function retrieveSalesOrders(salesOrder) {
    let salesOrderWithSolaceMessage = {}
    console.log(salesOrder.getBinaryAttachment())
    salesOrderWithSolaceMessage['salesOrder'] = JSON.parse(salesOrder.getBinaryAttachment());
    salesOrderWithSolaceMessage['solaceMessage'] = salesOrder
    dmqOrders.value.push(salesOrderWithSolaceMessage)
  }

  
  function pauseDmQBrowsing() {
//    mqttStore.removeSubscriptionHandler('sales/order/v1/#')
    queueBrowserStore.stopBrowse(queueName)
  }
  
  function updateSelectedDmqOrder(salesOrder) {
    selectedDmqOrder.value = salesOrder
  }
  
  function getSelectedDmqOrderAsText() {
    return JSON.stringify(selectedDmqOrder.value.salesOrder)
  }
  
  function submitUpdatedSalesOrder(updatedSalesOrder) {
    try {
      queueBrowserStore.publishUpdatedMessage(updatedSalesOrder, selectedDmqOrder.value.solaceMessage.getDestination().getName())
      queueBrowserStore.removeMessageFromDmQ(queueName,selectedDmqOrder.value.solaceMessage)
      selectedDmqOrder.value = null
      dmqOrders.value = []
      queueBrowserStore.stopBrowse(queueName)
      listenForDmqOrders()
    } catch (error) {
      console.log(error)
    }
  }
  
  
  return {
    dmqOrders,
    selectedDmqOrder,
    updateSelectedDmqOrder,
    pauseDmQBrowsing,
    listenForDmqOrders,
    getSelectedDmqOrderAsText,
    submitUpdatedSalesOrder
  }
  }, {persist: true})