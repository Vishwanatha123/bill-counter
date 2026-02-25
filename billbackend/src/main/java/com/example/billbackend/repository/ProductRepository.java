package com.example.billbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.billbackend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}