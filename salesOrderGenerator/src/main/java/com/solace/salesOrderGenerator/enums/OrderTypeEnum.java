package com.solace.salesOrderGenerator.enums;

import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.concurrent.ThreadLocalRandom;

@NoArgsConstructor
public enum OrderTypeEnum {
    STANDARD(),
    EXPRESS(),
    RUSH();

    public static OrderTypeEnum getRandomOrderType() {
        return OrderTypeEnum.values()[ThreadLocalRandom.current().nextInt(0,3)];
    }

    @Override
    public String toString() {
        return this.name();
    }
}
