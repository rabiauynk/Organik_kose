package com.example.Organik.Kose.service;

import com.example.Organik.Kose.model.Cart;
import com.example.Organik.Kose.model.Product;
import com.example.Organik.Kose.model.User;
import com.example.Organik.Kose.repository.CartRepository;
import com.example.Organik.Kose.repository.ProductRepository;
import com.example.Organik.Kose.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void addToCart(Long userId, Long productId, Integer quantity) {
        System.out.println("CartService: Adding to cart - User ID: " + userId + ", Product ID: " + productId + ", Quantity: " + quantity);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product is active
        if (!product.getAktif()) {
            throw new RuntimeException("Product is not active");
        }

        // Check stock
        if (product.getStok() < quantity) {
            throw new RuntimeException("Stok yetersiz. Mevcut stok: " + product.getStok());
        }

        // Check if item already exists in cart
        Optional<Cart> existingCartItem = cartRepository.findByUserIdAndProductId(userId, productId);

        if (existingCartItem.isPresent()) {
            // Update quantity
            Cart cartItem = existingCartItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;

            System.out.println("CartService: Product stock: " + product.getStok() + ", Current cart quantity: " + cartItem.getQuantity() + ", Requested quantity: " + quantity + ", New total quantity: " + newQuantity);

            // Check stock for new quantity
            if (product.getStok() < newQuantity) {
                throw new RuntimeException("Stok yetersiz. Sepetinizde zaten " + cartItem.getQuantity() + " adet var. Mevcut stok: " + product.getStok() + ", Toplam istenen: " + newQuantity);
            }

            cartItem.setQuantity(newQuantity);
            cartRepository.save(cartItem);
            System.out.println("CartService: Updated existing cart item, new quantity: " + newQuantity);
        } else {
            // Create new cart item
            Cart cartItem = new Cart();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartRepository.save(cartItem);
            System.out.println("CartService: Created new cart item");
        }
    }

    public List<Cart> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Transactional
    public void updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            removeFromCart(userId, productId);
            return;
        }

        Cart cartItem = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = cartItem.getProduct();
        if (product.getStok() < quantity) {
            throw new RuntimeException("Stok yetersiz. Mevcut stok: " + product.getStok() + ", İstenen: " + quantity);
        }

        cartItem.setQuantity(quantity);
        cartRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        Cart cartItem = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
