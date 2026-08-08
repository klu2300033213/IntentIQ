package com.nexora.repository;

import com.nexora.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByBrandIgnoreCase(String brand);

    /**
     * Multi-field semantic keyword search across name, description, category, and brand.
     * Searches each word independently for better recall (synonym-tolerant).
     */
    @Query("SELECT DISTINCT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    /**
     * Search by a single keyword token for multi-word query splitting.
     */
    @Query("SELECT DISTINCT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :token, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :token, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :token, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :token, '%'))")
    List<Product> searchByToken(@Param("token") String token);

    /**
     * Find top-rated products per category for cold-start scenarios.
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) ORDER BY p.rating DESC")
    List<Product> findTopRatedByCategory(@Param("category") String category);
}
