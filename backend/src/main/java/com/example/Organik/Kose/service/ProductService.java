package com.example.Organik.Kose.service;
import com.example.Organik.Kose.dto.ProductDTO;
import com.example.Organik.Kose.model.Category;
import com.example.Organik.Kose.model.Product;
import com.example.Organik.Kose.repository.CategoryRepository;
import com.example.Organik.Kose.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findByAktifTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndAktifTrue(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String searchTerm) {
        return productRepository.findBySearchTerm(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setIsim(productDTO.getIsim());
        product.setFiyat(productDTO.getFiyat());
        product.setAçıklama(productDTO.getAçıklama());
        product.setResimUrl(productDTO.getResimUrl());
        product.setStok(productDTO.getStok());
        product.setCategory(category);

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (productDTO.getIsim() != null) product.setIsim(productDTO.getIsim());
        if (productDTO.getFiyat() != null) product.setFiyat(productDTO.getFiyat());
        if (productDTO.getAçıklama() != null) product.setAçıklama(productDTO.getAçıklama());
        if (productDTO.getResimUrl() != null) product.setResimUrl(productDTO.getResimUrl());
        if (productDTO.getStok() != null) product.setStok(productDTO.getStok());
        if (productDTO.getAktif() != null) product.setAktif(productDTO.getAktif());

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setIsim(product.getIsim());
        dto.setFiyat(product.getFiyat());
        dto.setAçıklama(product.getAçıklama());
        dto.setResimUrl(product.getResimUrl());
        dto.setStok(product.getStok());
        dto.setAktif(product.getAktif());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        return dto;
    }
}
