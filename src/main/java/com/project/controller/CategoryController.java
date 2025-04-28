package com.project.controller;

import com.project.model.Category;
import com.project.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/api/categories")
    public List<Category> getAllCategories() {
        return (List<Category>) categoryRepository.findAll();
    }
}
