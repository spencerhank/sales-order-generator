package com.solace.salesOrderGenerator.enums;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
public enum OrderStatusEnum {

    CREATED,
    UPDATED,
    CANCELLED;

    @Override
    public String toString() {
        return this.name();
    }
}
