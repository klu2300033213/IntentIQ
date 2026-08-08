package com.nexora.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_category", columnList = "category"),
        @Index(name = "idx_product_brand", columnList = "brand")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private Long id;

    private String name;
    private String brand;

    @Column(length = 2000)
    private String description;

    private String category;
    private Double price;
    private Double oldPrice;
    private Integer discount;
    private Double rating;
    private Integer reviews;
    private String stock;
    private String delivery;

    @Column(length = 1000)
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 1000)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    private Integer aiScore;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_embeddings", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "vector_val")
    @Builder.Default
    private List<Double> embedding = new ArrayList<>();
}
