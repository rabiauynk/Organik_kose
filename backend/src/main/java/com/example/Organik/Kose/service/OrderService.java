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
        order.setStatus("Hazırlanıyor");
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
        System.out.println("OrderService: Creating order for userId: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("OrderService: User found: " + user.getEmail());

        List<Cart> cartItems = cartRepository.findByUserId(userId);
        System.out.println("OrderService: Cart items found: " + cartItems.size());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total amount first
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Check stock
            if (product.getStok() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getIsim());
            }

            totalAmount = totalAmount.add(product.getFiyat().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // Create order with calculated total
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Hazırlanıyor");
        order.setTotalAmount(totalAmount);

        order = orderRepository.save(order);

        // Create order details from cart
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setPrice(product.getFiyat());

            orderDetailRepository.save(orderDetail);

            // Update product stock
            product.setStok(product.getStok() - cartItem.getQuantity());
            productRepository.save(product);
        }

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
        System.out.println("OrderService: Updating order " + orderId + " to status: " + status);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        System.out.println("OrderService: Found order with current status: " + order.getStatus());

        order.setStatus(status);
        order = orderRepository.save(order);

        System.out.println("OrderService: Order saved with new status: " + order.getStatus());

        return convertToDTO(order);
    }

    @Transactional
    public int migrateOrderStatuses() {
        System.out.println("OrderService: Starting status migration...");

        List<Order> allOrders = orderRepository.findAll();
        int updatedCount = 0;

        for (Order order : allOrders) {
            String currentStatus = order.getStatus();
            String newStatus = null;

            switch (currentStatus.toUpperCase()) {
                case "PENDING":
                case "PROCESSING":
                    newStatus = "Hazırlanıyor";
                    break;
                case "SHIPPED":
                    newStatus = "Kargoda";
                    break;
                case "DELIVERED":
                    newStatus = "Teslim Edildi";
                    break;
                case "CANCELLED":
                    newStatus = "İptal Edildi";
                    break;
                default:
                    // Eğer zaten Türkçe ise değiştirme
                    if (List.of("Yeni", "Hazırlanıyor", "Kargoda", "Teslim Edildi", "İptal Edildi").contains(currentStatus)) {
                        continue;
                    }
                    newStatus = "Hazırlanıyor"; // Default
                    break;
            }

            if (newStatus != null && !newStatus.equals(currentStatus)) {
                System.out.println("Migrating order " + order.getId() + " from '" + currentStatus + "' to '" + newStatus + "'");
                order.setStatus(newStatus);
                orderRepository.save(order);
                updatedCount++;
            }
        }

        System.out.println("OrderService: Migration completed. Updated " + updatedCount + " orders.");
        return updatedCount;
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
