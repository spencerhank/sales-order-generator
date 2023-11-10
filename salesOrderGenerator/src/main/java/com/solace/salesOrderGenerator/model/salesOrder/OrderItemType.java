package com.solace.salesOrderGenerator.model.salesOrder;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
public class OrderItemType {

    private String item;
    private String material;
    private String materialType;
    private String itemType;
    private Integer quantity;

}
