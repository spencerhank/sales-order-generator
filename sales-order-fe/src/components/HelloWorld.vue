<template>
  <v-container v-if="!salesOrderStore.selectedSalesOrder" class="fill-height">
    <v-responsive class="pt-10 text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <div class="text-h2 text-left">Sales Order Stream</div>
          <div class="text-body-1 text-left mt-5">Total Number Of Results: {{
              salesOrderStore.salesOrders.length
            }}
          </div>
          <div class="text-body-1 text-left mt-3">
            <v-btn class="mr-2" color="primary" @click.prevent="salesOrderStore.listenForSalesOrders()">Resume Sales
              Orders
              Stream
            </v-btn>
            <v-btn class="mr-2" color="yellow" @click.prevent="salesOrderStore.pauseSalesOrders()">Pause Sales Orders
              Stream
            </v-btn>
            <v-btn color="red" @click.prevent="salesOrderStore.clearSalesOrders()">Clear Sales Orders</v-btn>
          </div>
          <div class=py-5></div>
          <v-table
            fixed-header
            height="500px"
            hover
            class="border-sm"
            v-if="salesOrderStore.salesOrders.length > 0"
          >
            <thead>
            <tr>
              <th v-for="header in headers" :key=header.key
                  class="border-b-sm border-e-sm text-primary text-center text-h6 pa-2"
              >
                <a v-if="header.key !== 'customer.customerName' && header.key !== 'orderItems'"
                   @click.prevent="flipSortOrder(header.key); sortKey = header.key">{{ header.display }}</a>
                <a v-if="header.key === 'customer.customerName' || header.key === 'orderItems'"
                >{{ header.display }}</a>
                <v-icon v-if="sortKey === header.key && isSortOrderAscending">mdi-arrow-up</v-icon>
                <v-icon v-if="sortKey === header.key && !isSortOrderAscending">mdi-arrow-down</v-icon>
              </th>
            </tr>
            </thead>
            <tbody class="border-lg">
            <tr
              class="table-primary"
              v-for="(item, i) in sortedSalesOrders"
              :key="item.salesOrg+ item.salesOrderNumber + i"
            >
              <td class="text-h6 border-e-sm">{{ item.salesOrg }}</td>
              <td class="text-h6 border-e-sm">
                {{ item.salesOrderNumber }}
              </td>
              <td class="text-h6 border-e-sm">{{ item.orderStatus }}</td>
              <td class="text-h6 border-e-sm">{{ item.customer.customerName }}</td>
              <td class="text-h6 border-e-sm">{{ item.creator }}</td>
              <td class="text-h6 border-e-sm">{{ formatDate(item.date) }}</td>
              <td class="text-h6 border-e-sm">{{ item.salesType }}</td>
              <td class="text-h6 border-e-sm">{{ item.orderType }}</td>
              <td class="text-h6 border-e-sm">{{ item.distributionChannel }}</td>
              <td class="text-h6 border-e-sm">
                <tr>
                  <td>Number Of Items: {{ salesOrderStore.getNumberOfItemsInSalesOrder(item.orderItems) }}</td>
                </tr>
                <tr>
                  <td>
                    <v-btn variant="text" color="blue" @click.prevent=salesOrderStore.updateSelectedSalesOrder(item)>
                      View Details
                    </v-btn>
                  </td>
                </tr>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <SelectedSalesOrder v-if="salesOrderStore.selectedSalesOrder"/>
</template>

<script setup>
import {ref, computed} from "vue";
import {useSalesOrderStore} from "@/store/salesOrderStore";
import SelectedSalesOrder from "@/components/SelectedSalesOrder.vue";

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


const sortKey = ref('date')
const isSortOrderAscending = ref(true)
const salesOrderStore = useSalesOrderStore();

const sortedSalesOrders = computed(() => {
  return salesOrderStore.salesOrders.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return isSortOrderAscending.value ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return isSortOrderAscending.value ? 1 : -1;
    if ((a[sortKey.value] === b[sortKey.value])) {
      if (a['salesOrderNumber'] < b['salesOrderNumber']) return isSortOrderAscending ? -1 : 1;
      if (a['salesOrderNumber'] > b['salesOrderNumber']) return isSortOrderAscending ? 1 : -1;
    }
    return 0;
  })
})

function flipSortOrder(newSortKey) {
  if (sortKey.value === newSortKey) {
    isSortOrderAscending.value = !isSortOrderAscending.value
  } else {
    isSortOrderAscending.value = true
  }
}

function formatDate(timeStamp) {
  let date = new Date(timeStamp);

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
}
</script>
