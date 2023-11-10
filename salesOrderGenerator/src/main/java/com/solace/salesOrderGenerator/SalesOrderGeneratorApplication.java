package com.solace.salesOrderGenerator;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.solace.salesOrderGenerator.enums.*;
import com.solace.salesOrderGenerator.model.salesOrder.CustomerType;
import com.solace.salesOrderGenerator.model.salesOrder.OrderHeaderType;
import com.solace.salesOrderGenerator.model.salesOrder.OrderItemType;
import com.solace.spring.cloud.stream.binder.messaging.SolaceHeaders;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.binder.BinderHeaders;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Supplier;

@SpringBootApplication
public class SalesOrderGeneratorApplication {

    private ConcurrentHashMap<String, OrderHeaderType> existingSalesOrder = new ConcurrentHashMap<>();

    public static void main(String[] args) {
        SpringApplication.run(SalesOrderGeneratorApplication.class, args);
    }

    @Bean
    public Supplier<Message<OrderHeaderType>> salesOrderSimulator() {
        return () -> {
            OrderHeaderType randomSalesOrder = generateRandomSalesOrder();
            return MessageBuilder.withPayload(randomSalesOrder)
                    .setHeader(BinderHeaders.TARGET_DESTINATION, generateTopicString(randomSalesOrder))
                    .setHeader(SolaceHeaders.DMQ_ELIGIBLE, true).build();
        };
    }

    private String generateTopicString(OrderHeaderType orderHeaderType) {
        return StringUtils.joinWith("/",
                "sales",
                "order",
                "v1",
                orderHeaderType.getOrderStatus(),
                orderHeaderType.getOrderType(),
                orderHeaderType.getDistributionChannel(),
                orderHeaderType.getSalesType(),
                orderHeaderType.getCustomer().getCustomerId(),
                orderHeaderType.getSalesOrderNumber()
        );
    }

    private OrderHeaderType generateRandomSalesOrder() {
        OrderHeaderType salesOrderType = new OrderHeaderType();

//        TODO: get more random sales order numbers
        salesOrderType.setSalesOrderNumber("SO" + ThreadLocalRandom.current().nextInt(1000));
        salesOrderType.setOrderStatus(OrderStatusEnum.CREATED.toString());
        salesOrderType.setDate(Date.from(Instant.now()));
        salesOrderType.setCreator(CreatorEnum.getRandomCreator().getDisplayName());

        if(existingSalesOrder.containsKey(salesOrderType.getSalesOrderNumber())) {
            OrderHeaderType existingOrder = existingSalesOrder.get(salesOrderType.getSalesOrderNumber());
            if(ThreadLocalRandom.current().nextInt(10) == 0) {
                // Cancel the order and remove from map of existing orders
                existingOrder.setOrderStatus(OrderStatusEnum.CANCELLED.name());
                existingSalesOrder.remove(existingOrder.getSalesOrderNumber());
                return existingOrder;
            } else {
                // Update random item in the order
                existingOrder.setOrderStatus(OrderStatusEnum.UPDATED.name());
                if(!existingOrder.getOrderItems().isEmpty()) {
                    int indexToUpdate = ThreadLocalRandom.current().nextInt(existingOrder.getOrderItems().size());
                    OrderItemType updatedOrderItem = existingOrder.getOrderItems().get(indexToUpdate);
                    updatedOrderItem.setQuantity(ThreadLocalRandom.current().nextInt(200));
                    existingOrder.getOrderItems().set(indexToUpdate,updatedOrderItem);
                    existingOrder.setDate(Date.from(Instant.now()));

                    existingSalesOrder.put(existingOrder.getSalesOrderNumber(), existingOrder);
                    return existingOrder;
                }

            }

        }


        PersonEnum randomCustomer = PersonEnum.getRandomPerson();
        salesOrderType.setSalesOrg(randomCustomer.getSalesOrgEnum().getSalesOrgDisplayName());
        salesOrderType.setCustomer(new CustomerType(randomCustomer));

        List<OrderItemType> orderItemTypes = new ArrayList<>();
        int bound = ThreadLocalRandom.current().nextInt(1,20);
        boolean createdInvalidOrderItem = false;
        for (int i = 0; i < bound; i++) {
            OrderItemType orderItemType = new OrderItemType();
            ItemEnum item = ItemEnum.getRandomItemEnum();

            orderItemType.setItem(item.getItemName());
            orderItemType.setItemType(item.getItemType());
            orderItemType.setMaterialType(item.getMaterialType());
            orderItemType.setMaterial(item.getMaterialName());

            if(!createdInvalidOrderItem && ThreadLocalRandom.current().nextInt(100) == 1) {
                // Create an invalid order every so often for our DMQ
                createdInvalidOrderItem = true;
            } else {
                orderItemType.setQuantity(ThreadLocalRandom.current().nextInt(200));
            }
            orderItemTypes.add(orderItemType);

        }
        salesOrderType.setSalesType(SalesOrderTypeEnum.getRandomSalesOrderType().toString());
        salesOrderType.setOrderItems(orderItemTypes);
        salesOrderType.setOrderType(OrderTypeEnum.getRandomOrderType().toString());
        salesOrderType.setDistributionChannel(DistributionChannelEnum.getRandomDistributionChannel().name());

        existingSalesOrder.put(salesOrderType.getSalesOrderNumber(), salesOrderType);

        return salesOrderType;


    }

}
