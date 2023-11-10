<template>
  <v-container class="fill-height">
    <v-responsive class="pt-10 text-left fill-height">
      <v-row class="d-flex align justify-center">
        <v-col cols="auto">
          <div class="text-body-1">
            <v-btn color="blue" @click.prevent="salesOrderStore.selectedSalesOrder = null">Back</v-btn>
          </div>
          <div class="text-h4 mt-5">Details for Sales
            Order: {{ salesOrderStore.selectedSalesOrder.salesOrderNumber }}
          </div>
          <div class="mt-5">Sales Org: {{ salesOrderStore.selectedSalesOrder.salesOrg }}</div>
          <div class="text-body-1">Order Status: {{ salesOrderStore.selectedSalesOrder.orderStatus }}</div>
          <div class="text-body-1">Customer Name: {{ salesOrderStore.selectedSalesOrder.customer.customerName }}</div>
          <div class="text-body-1">Address: {{ formatAddress(salesOrderStore.selectedSalesOrder.customer) }}</div>
          <div class="text-body-1">Creator: {{ salesOrderStore.selectedSalesOrder.creator }}</div>
          <div class="text-body-1">Created Date: {{ formatDate(salesOrderStore.selectedSalesOrder.date) }}</div>
          <div class="text-body-1">Sales Type: {{ salesOrderStore.selectedSalesOrder.salesType }}</div>
          <div class="text-body-1">Order Type: {{ salesOrderStore.selectedSalesOrder.orderType }}</div>
          <div class="text-body-1">Distribution Channel: {{
              salesOrderStore.selectedSalesOrder.distributionChannel
            }}
          </div>
          <div class="text-body-1 ">Order Items ({{
              salesOrderStore.selectedSalesOrder.orderItems.length
            }}):
            <v-virtual-scroll :items=salesOrderStore.selectedSalesOrder.orderItems :height=500>
              <template v-slot:default="{item}">
                <v-card :title=item.item
                        :subtitle="'Material: ' +item.material"
                        class="ma-4"
                        variant=tonal
                >
                  <div class="text-body-1 pl-4">Item Type: {{ item.itemType }}</div>
                  <div class="text-body-1 pl-4">Material Type: {{ item.materialType }}</div>
                  <div class="text-body-1 pl-4 pb-4">Quantity: {{ item.quantity }}</div>

                </v-card>
              </template>
            </v-virtual-scroll>

          </div>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import {ref, computed} from "vue";
import {useSalesOrderStore} from "@/store/salesOrderStore";

const salesOrderStore = useSalesOrderStore();

function formatAddress(customer) {
  return `${customer.street} ${customer.city} ${customer.state} ${customer.zipCode}`
}

function formatDate(timeStamp) {
  let date = new Date(timeStamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
}

function formatOrderItemText(orderItem) {
  return orderItem
}

</script>
