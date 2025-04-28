package com.project.service;

import com.project.model.Category;
import com.project.repository.CategoryRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Component
public interface CategoryService {
    Category addCategory(Category category);
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryByName(String name);
    Category updateCategory(Long categoryId, Category category);
    void deleteCategory(Long id);
}

