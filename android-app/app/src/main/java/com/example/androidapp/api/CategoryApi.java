package com.example.androidapp.api;

import com.example.androidapp.data.model.response.CategoryResponse;

import java.util.List;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;
import retrofit2.http.DELETE;

public interface CategoryApi {
    @GET("categories")
    Call<List<CategoryResponse>> getCategories(
            @Header("Authorization") String token);

    @DELETE("categories/{id}")
    Call<ResponseBody> deleteCategory(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Path("id") int categoryId
    );
}
