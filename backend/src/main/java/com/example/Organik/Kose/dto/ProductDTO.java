package com.example.Organik.Kose.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String isim;
    private BigDecimal fiyat;
    private String açıklama;
    private String resimUrl;
    private Integer stok;
    private Boolean aktif;
    private Long categoryId;
    private String categoryName;
}
