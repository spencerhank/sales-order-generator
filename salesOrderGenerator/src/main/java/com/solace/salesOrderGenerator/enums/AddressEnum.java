package com.solace.salesOrderGenerator.enums;

import lombok.Data;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum AddressEnum {
    ADDRESS_1("123 Main Street", "Anytown", "CA", "12345"),
    ADDRESS_2("456 Elm Avenue", "Springfield", "IL", "67890"),
    ADDRESS_3("789 Oak Road", "Riverside", "NJ", "23456"),
    ADDRESS_4("101 Pine Lane", "Charleston", "SC", "34567"),
    ADDRESS_5("234 Maple Drive", "Denver", "CO", "45678"),
    ADDRESS_6("567 Birch Street", "Phoenix", "AZ", "56789"),
    ADDRESS_7("890 Cedar Court", "Seattle", "WA", "67890"),
    ADDRESS_8("321 Walnut Lane", "Orlando", "FL", "78901"),
    ADDRESS_9("654 Cherry Avenue", "Dallas", "TX", "89012"),
    ADDRESS_10("987 Spruce Road", "Atlanta", "GA", "90123");

    private final String street;
    private final String city;
    private final String state;
    private final String zipcode;

    AddressEnum(String street, String city, String state, String zipcode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
    }
}
