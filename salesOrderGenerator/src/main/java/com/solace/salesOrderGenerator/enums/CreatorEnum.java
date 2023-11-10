package com.solace.salesOrderGenerator.enums;

import lombok.Getter;
import lombok.ToString;

import java.util.concurrent.ThreadLocalRandom;

@Getter
@ToString
public enum CreatorEnum {

    CREATOR_1("Zephyr Halloway"),
    CREATOR_2("Sarah Wrenwood"),
    CREATOR_3("Orion Thornehill");

    private String displayName;

    CreatorEnum(String displayName) {
        this.displayName = displayName;
    }

    public static CreatorEnum getRandomCreator() {
        return CreatorEnum.values()[ThreadLocalRandom.current().nextInt(CreatorEnum.values().length)];
    }


}
