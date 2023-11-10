import { ref } from 'vue'
import { defineStore } from 'pinia'
//import {useMqttStore} from "@/store/mqtt";
import {useSolaceStore} from "@/store/solace";

export const useSalesOrderStore = defineStore('salesOrderStore', () => {
//  const mqttStore = useMqttStore();
//  mqttStore.login()
  const solaceStore = useSolaceStore();
  solaceStore.connect()
  
  
  
  const salesOrders = ref([]);
  const selectedSalesOrder = ref(null)
  
  function listenForSalesOrders() {
//    mqttStore.addSubscriptionHandler('sales/order/v1/#', addNewSalesOrders)
    solaceStore.consume('q.sales.orders', addNewSalesOrders)
  }
  
  function addNewSalesOrders(result) {
//    console.log(result.getBinaryAttachment());
    let validSalesOrder = true
    let salesOrder = JSON.parse(result.getBinaryAttachment());
    for(var i = 0; i < salesOrder.orderItems.length; i++) {
      if(salesOrder.orderItems[i] && salesOrder.orderItems[i].quantity == null) {
        validSalesOrder = false;
        break;
      }
    }
    if(validSalesOrder) {
      salesOrders.value.push(salesOrder)
      result.acknowledge()
    } else {
      throw new Error('Message contains invalid order items. Throwing error to trigger Nack')
    }
    
  }
  
  function getNumberOfItemsInSalesOrder(salesOrder) {
    if(salesOrder && salesOrder.length) {
      let quantity = 0
      
      salesOrder.forEach(orderItem => {
        if(orderItem.quantity) {
          quantity += orderItem.quantity
        }  
      })
      return quantity;
    }
    return 0;
  }
  
  function clearSalesOrders() {
    salesOrders.value = []
  }
  
  function pauseSalesOrders() {
//    mqttStore.removeSubscriptionHandler('sales/order/v1/#')
    solaceStore.stopConsume('q.sales.orders')
  }
  
  function updateSelectedSalesOrder(salesOrder) {
    selectedSalesOrder.value = salesOrder
  }
  
  
  return {
    salesOrders,
    selectedSalesOrder,
    addNewSalesOrders,
    pauseSalesOrders,
    clearSalesOrders,
    updateSelectedSalesOrder,
    listenForSalesOrders,
    getNumberOfItemsInSalesOrder
  }
  }, {persist: true})