package com.solace.salesOrderGenerator.enums;

import lombok.Getter;
import lombok.ToString;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Getter
@ToString
public enum PersonEnum {

    PERSON_1("John", "Doe", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_1),
    PERSON_2("Jane", "Smith", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_2),
    PERSON_3("Bob", "Johnson", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_3),
    PERSON_4("Alice", "Williams", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_4),
    PERSON_5("David", "Brown", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_5),
    PERSON_6("Ella", "Davis", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_6),
    PERSON_7("Frank", "Wilson", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_7),
    PERSON_8("Grace", "Anderson", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_8),
    PERSON_9("Henry", "Jones", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_9),
    PERSON_10("Olivia", "Miller", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_10),
    PERSON_11("Sam", "Garcia", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_2),
    PERSON_12("Sophia", "Martinez", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_3),
    PERSON_13("Tom", "Taylor", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_4),
    PERSON_14("Lily", "White", SalesOrgEnum.SALES_ORG_2 , AddressEnum.ADDRESS_5),
    PERSON_15("Daniel", "Thomas", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_6),
    PERSON_16("Emma", "Lee", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_7),
    PERSON_17("Matthew", "Harris", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_8),
    PERSON_18("Ava", "Clark", SalesOrgEnum.SALES_ORG_3, AddressEnum.ADDRESS_9),
    PERSON_19("William", "Walker", SalesOrgEnum.SALES_ORG_1, AddressEnum.ADDRESS_10),
    PERSON_20("Sophie", "Jackson", SalesOrgEnum.SALES_ORG_2, AddressEnum.ADDRESS_2);

    private final String firstName;
    private final String lastName;
    private final SalesOrgEnum salesOrgEnum;
    private final AddressEnum addressEnum;

    PersonEnum(String firstName, String lastName, SalesOrgEnum salesOrgEnum, AddressEnum addressEnum) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.salesOrgEnum = salesOrgEnum;
        this.addressEnum = addressEnum;
    }

    public static PersonEnum getRandomPerson() {
        return PersonEnum.values()[ThreadLocalRandom.current().nextInt(0,20)];
    }

    public static List<PersonEnum> getBySalesOrg(SalesOrgEnum salesOrgEnum) {
        return Arrays.stream(PersonEnum.values()).filter(pe -> pe.getSalesOrgEnum().equals(salesOrgEnum)).toList();
    }

}
