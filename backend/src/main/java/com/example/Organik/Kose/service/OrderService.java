package com.example.Organik.Kose.service;

import com.example.Organik.Kose.dto.OrderDTO;
import com.example.Organik.Kose.dto.OrderDetailDTO;
import com.example.Organik.Kose.model.*;
import com.example.Organik.Kose.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    @Transactional
    public OrderDTO createOrder(Long userId, OrderDTO orderDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setTotalAmount(orderDTO.getTotalAmount());

        order = orderRepository.save(order);

        // Create order details
        BigDecimal calculatedTotal = BigDecimal.ZERO;
        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            Product product = productRepository.findById(detailDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Check stock
            if (product.getStok() < detailDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getIsim());
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(detailDTO.getQuantity());
            orderDetail.setPrice(product.getFiyat());

            orderDetailRepository.save(orderDetail);

            // Update product stock
            product.setStok(product.getStok() - detailDTO.getQuantity());
            productRepository.save(product);

            calculatedTotal = calculatedTotal.add(product.getFiyat().multiply(BigDecimal.valueOf(detailDTO.getQuantity())));
        }

        // Update order total
        order.setTotalAmount(calculatedTotal);
        order = orderRepository.save(order);

        // Clear user's cart
        cartRepository.deleteByUserId(userId);

        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO createOrderFromCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        order = orderRepository.save(order);

        // Create order details from cart
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Check stock
            if (product.getStok() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getIsim());
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setPrice(product.getFiyat());

            orderDetailRepository.save(orderDetail);

            // Update product stock
            product.setStok(product.getStok() - cartItem.getQuantity());
            productRepository.save(product);

            totalAmount = totalAmount.add(product.getFiyat().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // Update order total
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Clear user's cart
        cartRepository.deleteByUserId(userId);

        return convertToDTO(order);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        order = orderRepository.save(order);
        
        return convertToDTO(order);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getName());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());

        if (order.getOrderDetails() != null) {
            List<OrderDetailDTO> orderDetails = order.getOrderDetails().stream()
                    .map(this::convertDetailToDTO)
                    .collect(Collectors.toList());
            dto.setOrderDetails(orderDetails);
        }

        return dto;
    }

    private OrderDetailDTO convertDetailToDTO(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setId(orderDetail.getId());
        dto.setProductId(orderDetail.getProduct().getId());
        dto.setProductName(orderDetail.getProduct().getIsim());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setPrice(orderDetail.getPrice());
        return dto;
    }
}
