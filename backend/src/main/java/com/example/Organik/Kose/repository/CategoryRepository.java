package com.example.Organik.Kose.repository;
import com.example.Organik.Kose.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByAktifTrue();
    boolean existsByName(String name);
}
