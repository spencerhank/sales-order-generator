package com.solace.salesOrderGenerator.enums;


import lombok.Getter;
import lombok.ToString;

import java.util.concurrent.ThreadLocalRandom;

@Getter
@ToString
public enum SalesOrgEnum {
    SALES_ORG_1(1, "SAO1"),
    SALES_ORG_2(2, "SAO2"),
    SALES_ORG_3(3, "SAO3");

    private int salesOrgId;
    private String salesOrgDisplayName;

    SalesOrgEnum(int salesOrgId, String salesOrgDisplayName) {
        this.salesOrgId = salesOrgId;
        this.salesOrgDisplayName = salesOrgDisplayName;
    }

    public static SalesOrgEnum getRandomSalesOrg() {
        return SalesOrgEnum.values()[ThreadLocalRandom.current().nextInt(0, 3)];
    }


}