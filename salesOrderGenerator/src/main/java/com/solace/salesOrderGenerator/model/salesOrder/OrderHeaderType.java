package com.solace.salesOrderGenerator.model.salesOrder;

import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
public class OrderHeaderType {

    private String orderStatus;
    private String salesOrderNumber;
    private String creator;
    private Date date;
    private String salesType;
    private String orderType;
    private String salesOrg;
    private String distributionChannel;
    private CustomerType customer;
    private List<OrderItemType> orderItems;

}
