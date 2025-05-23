package com.example.androidapp.data.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.androidapp.data.model.entity.Category;

import java.util.List;

import retrofit2.http.DELETE;

@Dao
public interface CategoryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertCategories(List<Category> categories);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertCategory(Category category); // Add a single category

    @Query("SELECT * FROM categories WHERE promoted = 1")
    List<Category> getPromotedCategories();
    @Query("SELECT * FROM categories WHERE id = :categoryId")
    Category getCategoryById(int categoryId);
    @Query("DELETE FROM categories WHERE id = :categoryId")
    void deleteCategoryById(int categoryId);

    @Update
    void updateCategory(Category category); // Add the update method
}
