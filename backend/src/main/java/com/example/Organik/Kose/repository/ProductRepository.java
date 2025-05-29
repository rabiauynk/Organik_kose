package com.example.Organik.Kose.repository;
import com.example.Organik.Kose.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAktifTrue();
    List<Product> findByCategoryIdAndAktifTrue(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.aktif = true AND " +
           "(LOWER(p.isim) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.açıklama) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Product> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    List<Product> findByStokGreaterThan(Integer stok);
}
