package com.solace.salesOrderGenerator.model.salesOrder;

import com.solace.salesOrderGenerator.enums.PersonEnum;
import lombok.*;

@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
public class CustomerType {
    private String customerId;
    private String customerName;
    private String zipCode;
    private String street;
    private String state;
    private String city;

    public CustomerType(PersonEnum personEnum) {
        this.customerId = String.valueOf(personEnum.getSalesOrgEnum().getSalesOrgId());
        this.customerName = personEnum.getFirstName() + " " + personEnum.getLastName();
        this.zipCode = personEnum.getAddressEnum().getZipcode();
        this.street = personEnum.getAddressEnum().getStreet();
        this.state = personEnum.getAddressEnum().getState();
        this.city = personEnum.getAddressEnum().getCity();
    }
}
