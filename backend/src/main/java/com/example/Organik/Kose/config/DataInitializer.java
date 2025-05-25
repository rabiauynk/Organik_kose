package com.example.Organik.Kose.config;

import com.example.Organik.Kose.model.Category;
import com.example.Organik.Kose.model.Product;
import com.example.Organik.Kose.model.User;
import com.example.Organik.Kose.repository.CategoryRepository;
import com.example.Organik.Kose.repository.ProductRepository;
import com.example.Organik.Kose.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user (delete and recreate to ensure BCrypt password)
        userRepository.findByEmail("admin@organikkose.com").ifPresent(userRepository::delete);

        User admin = new User();
        admin.setEmail("admin@organikkose.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setName("Admin");
        admin.setPhone("0555-123-4567");
        admin.setAddress("Admin Address");
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);

        // Create categories if not exist
        if (categoryRepository.count() == 0) {
            Category[] categories = {
                new Category(null, "Sirke", "Doğal fermente sirkeler", "🍎", true, LocalDateTime.now(), null),
                new Category(null, "Marmelat", "Ev yapımı marmelatlar", "🍓", true, LocalDateTime.now(), null),
                new Category(null, "Pekmez", "Geleneksel pekmezler", "🍇", true, LocalDateTime.now(), null),
                new Category(null, "Bal", "Doğal ve saf ballar", "🍯", true, LocalDateTime.now(), null),
                new Category(null, "Turşu", "Ev yapımı turşular", "🥒", true, LocalDateTime.now(), null),
                new Category(null, "Reçel", "Mevsim reçelleri", "🫐", true, LocalDateTime.now(), null)
            };

            for (Category category : categories) {
                categoryRepository.save(category);
            }
        }

        // Create sample products if not exist
        if (productRepository.count() == 0) {
            Category sirkeCategory = categoryRepository.findByAktifTrue().get(0);
            Category marmelatCategory = categoryRepository.findByAktifTrue().get(1);
            Category pekmezCategory = categoryRepository.findByAktifTrue().get(2);

            Product[] products = {
                new Product(null, "Elma Sirkesi", new BigDecimal("45.00"),
                    "Ev yapımı doğal elma sirkesi, fermentasyon ile üretilmiştir.",
                    "/placeholder.svg", 25, true, LocalDateTime.now(), null, sirkeCategory, null, null),
                new Product(null, "Çilek Marmelatı", new BigDecimal("35.00"),
                    "Taze çileklerden yapılmış doğal marmelat, şeker oranı düşük.",
                    "/placeholder.svg", 18, true, LocalDateTime.now(), null, marmelatCategory, null, null),
                new Product(null, "Dut Pekmezi", new BigDecimal("65.00"),
                    "Geleneksel yöntemlerle üretilmiş saf dut pekmezi.",
                    "/placeholder.svg", 12, true, LocalDateTime.now(), null, pekmezCategory, null, null)
            };

            for (Product product : products) {
                productRepository.save(product);
            }
        }
    }
}
