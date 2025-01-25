package com.example.androidapp.api;

import com.example.androidapp.data.model.response.CategoryResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface CategoryApi {
    @GET("categories")
    Call<List<CategoryResponse>> getCategories(
            @Header("Authorization") String token);
}
