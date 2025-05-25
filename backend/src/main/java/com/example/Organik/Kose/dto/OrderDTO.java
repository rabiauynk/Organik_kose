package com.example.Organik.Kose.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userName;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderDetailDTO> orderDetails;
    
    // Customer information for checkout
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;
}
