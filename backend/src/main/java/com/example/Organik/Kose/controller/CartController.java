package com.example.Organik.Kose.controller;

import com.example.Organik.Kose.model.Cart;
import com.example.Organik.Kose.service.CartService;
import com.example.Organik.Kose.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody AddToCartRequest request, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(jwt);

            System.out.println("Adding to cart - User ID: " + userId + ", Product ID: " + request.getProductId() + ", Quantity: " + request.getQuantity());

            cartService.addToCart(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("Product added to cart successfully");
        } catch (Exception e) {
            System.err.println("Error adding to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error adding product to cart: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getCartItems(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(jwt);

            List<Cart> cartItems = cartService.getCartItems(userId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCartItem(@RequestBody UpdateCartRequest request, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(jwt);

            cartService.updateCartItemQuantity(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("Cart item updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating cart item: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(jwt);

            cartService.removeFromCart(userId, productId);
            return ResponseEntity.ok("Product removed from cart successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing product from cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(jwt);

            cartService.clearCart(userId);
            return ResponseEntity.ok("Cart cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error clearing cart: " + e.getMessage());
        }
    }

    // Request DTOs
    public static class AddToCartRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class UpdateCartRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
