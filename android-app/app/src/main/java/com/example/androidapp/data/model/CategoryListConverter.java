package com.example.androidapp.data.model;

import androidx.room.TypeConverter;

import com.example.androidapp.data.model.entity.Category;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

public class CategoryListConverter {

    private static final Gson gson = new Gson();

    @TypeConverter
    public static String fromCategoryList(List<Category> categories) {
        if (categories == null) {
            return null;
        }
        return gson.toJson(categories);
    }

    @TypeConverter
    public static List<Category> toCategoryList(String categoryJson) {
        if (categoryJson == null) {
            return null;
        }
        Type listType = new TypeToken<List<Category>>() {}.getType();
        return gson.fromJson(categoryJson, listType);
    }
}
