<template>
  <v-container class="fill-height">
    <v-responsive class="pt-10 text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <div class="text-h2 text-left">Sales Order Stream Invalid Message Browser</div>
          <!--TODO: update store-->
          <div class="text-body-1 text-left mt-5">Total Number Of Results: {{
              dmqStore.dmqOrders.length
            }}
          </div>
          <!--<div class="text-body-1 text-left mt-3">-->
          <!--  <v-btn v-if="!dmqStore.selectedDmqOrder" class="mr-2" color="primary"-->
          <!--         @click.prevent="dmqStore.listenForDmqOrders()">Fetch Dead Messages-->
          <!--  </v-btn>-->
          <!--</div>-->

          <div class=py-5></div>
          <v-table
            fixed-header
            height="500px"
            hover
            class="border-sm"
            v-if="!dmqStore.selectedDmqOrder"
          >
            <thead>
            <tr>
              <th v-for="header in headers" :key=header.key
                  class="border-b-sm border-e-sm text-primary text-center text-h6 pa-2"
              >
                <a>{{ header.display }}</a>
              </th>
            </tr>
            </thead>
            <tbody class="border-lg">
            <!--TODO update store-->
            <tr
              class="table-primary"
              v-for="item in dmqStore.dmqOrders"
              :key="item.salesOrder.salesOrg+ item.salesOrder.salesOrderNumber + item.salesOrder.date"
            >
              <td class="text-h6 border-e-sm">{{ item.salesOrder.salesOrg }}</td>
              <td class="text-h6 border-e-sm">
                {{ item.salesOrder.salesOrderNumber }}
              </td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.orderStatus }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.customer.customerName }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.creator }}</td>
              <td class="text-h6 border-e-sm">{{ formatDate(item.salesOrder.date) }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.salesType }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.orderType }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesOrder.distributionChannel }}</td>
              <td class="text-h6 border-e-sm">
                <!--TODO: update click method to edit raw and add ability to submit change-->
                <v-btn variant="text" color="blue" @click.prevent="dmqStore.updateSelectedDmqOrder(item)">
                  Update Sales Order
                </v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
          <v-btn color="blue" v-if="dmqStore.selectedDmqOrder"
                 @click.prevent="dmqStore.selectedDmqOrder = null; dmqStore.dmqOrderUpdates = null">Back
          </v-btn>
          <div class="py-3"></div>
          <v-card v-if="dmqStore.selectedDmqOrder">
            <v-container class="text-h4 mt-5 text-left">Details for Sales
              Order: {{ dmqStore.selectedDmqOrder.salesOrder.salesOrderNumber }}
              <v-textarea :model-value="dmqStore.getSelectedDmqOrderAsText()" ref="orderEditsTextArea">
              </v-textarea>
              <v-btn color="primary" @click.prevent="submitOrderEdits()">Submit Changes</v-btn>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import {ref, computed} from "vue";
import {useDmqStore} from "@/store/dmqStore";

const dmqStore = useDmqStore()
dmqStore.listenForDmqOrders()
const orderEditsTextArea = ref(null)


const headers = [
  {key: 'salesOrg', display: 'Sales Org'},
  {key: 'salesOrderNumber', display: 'Order Id'},
  {key: 'orderStatus', display: 'Order Status'},
  {key: 'customer.customerName', display: 'Customer'},
  {key: 'creator', display: 'Creator'},
  {key: 'date', display: 'Created Date (YYYY-MM-DD)'},
  {key: 'salesType', display: 'Sales Type'},
  {key: 'orderType', display: 'OrderType'},
  {key: 'distributionChannel', display: 'Distribution Channel'},
  {key: 'orderItems', display: 'Order Items'},
]

function submitOrderEdits() {
  dmqStore.submitUpdatedSalesOrder(orderEditsTextArea.value.value)
}

function formatDate(timeStamp) {
  let date = new Date(timeStamp);

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
}
</script>
