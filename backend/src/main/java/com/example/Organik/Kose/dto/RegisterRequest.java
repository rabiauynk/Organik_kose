package com.example.Organik.Kose.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String address;
}
