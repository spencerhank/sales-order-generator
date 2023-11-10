package com.solace.salesOrderGenerator.enums;

import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.concurrent.ThreadLocalRandom;

@NoArgsConstructor
public enum DistributionChannelEnum {
    RETAIL,
    ONLINE,
    WHOLESALE;

    public static DistributionChannelEnum getRandomDistributionChannel() {
        return values()[ThreadLocalRandom.current().nextInt(DistributionChannelEnum.values().length)];
    }

    @Override
    public String toString() {
        return this.name();
    }
}
