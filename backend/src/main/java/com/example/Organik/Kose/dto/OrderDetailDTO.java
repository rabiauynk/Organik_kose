package com.example.Organik.Kose.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}

