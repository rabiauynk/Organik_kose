package com.example.Organik.Kose.controller;

import com.example.Organik.Kose.dto.OrderDTO;
import com.example.Organik.Kose.service.OrderService;
import com.example.Organik.Kose.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtUtil.extractUsername(jwt);
            Long userId = jwtUtil.extractUserId(jwt);

            OrderDTO createdOrder = orderService.createOrder(userId, orderDTO);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/from-cart")
    public ResponseEntity<?> createOrderFromCart(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtUtil.extractUsername(jwt);
            Long userId = jwtUtil.extractUserId(jwt);

            System.out.println("Creating order for user: " + userEmail + " (ID: " + userId + ")");

            OrderDTO createdOrder = orderService.createOrderFromCart(userId);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            System.err.println("Order creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtUtil.extractUsername(jwt);
            Long userId = jwtUtil.extractUserId(jwt);

            List<OrderDTO> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
