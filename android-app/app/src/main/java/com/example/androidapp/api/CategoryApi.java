package com.example.androidapp.api;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface CategoryApi {

    @DELETE("categories/{id}")
    Call<ResponseBody> deleteCategory(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Path("id") int categoryId
    );
}
