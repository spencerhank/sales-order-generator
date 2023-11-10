package com.solace.salesOrderGenerator.enums;

import lombok.Getter;
import lombok.ToString;

import java.util.concurrent.ThreadLocalRandom;

@Getter
@ToString
public enum ItemEnum {
    ITEM_1("ITEM001", "MAT001", "Product", "Standard"),
    ITEM_2("ITEM002", "MAT002", "Service", "Standard"),
    ITEM_3("ITEM003", "MAT003", "Product", "Standard"),
    ITEM_4("ITEM004", "MAT004", "Product", "Premium"),
    ITEM_5("ITEM005", "MAT005", "Service", "Standard"),
    ITEM_6("ITEM006", "MAT006", "Product", "Standard"),
    ITEM_7("ITEM007", "MAT007", "Product", "Standard"),
    ITEM_8("ITEM008", "MAT008", "Product", "Premium"),
    ITEM_9("ITEM009", "MAT009", "Product", "Premium"),
    ITEM_10("ITEM0010", "MAT010", "Service", "Standard");

    private final String itemName;
    private final String materialName;
    private final String materialType;
    private final String itemType;

    ItemEnum(String itemName, String materialName, String materialType, String itemType) {
        this.itemName = itemName;
        this.materialName = materialName;
        this.materialType = materialType;
        this.itemType = itemType;
    }

    public static ItemEnum getRandomItemEnum() {
        return ItemEnum.values()[ThreadLocalRandom.current().nextInt(0,10)];
    }
}