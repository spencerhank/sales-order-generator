package com.solace.salesOrderGenerator.enums;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.concurrent.ThreadLocalRandom;

@NoArgsConstructor
@Getter
public enum SalesOrderTypeEnum {

    IN_STORE("In Store"),
    ONLINE("Online"),
    PHONE("Phone");

    private String displayName;


    SalesOrderTypeEnum(String displayName) {
        this.displayName = displayName;
    }

    public static SalesOrderTypeEnum getRandomSalesOrderType() {
        return SalesOrderTypeEnum.values()[ThreadLocalRandom.current().nextInt(SalesOrderTypeEnum.values().length)];
    }

    @Override
    public String toString() {
        return this.name();
    }
}
