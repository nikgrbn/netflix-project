package com.example.androidapp.api;

import androidx.media3.common.C;

import com.example.androidapp.data.model.response.CategoryResponse;

import java.util.List;
import java.util.Map;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PartMap;
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
    @FormUrlEncoded
    @POST("categories")
    Call<ResponseBody> addCategory(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Field("name") String name,
            @Field("promoted") boolean promoted
    );

    @FormUrlEncoded
    @PATCH("categories/{id}")
    Call<ResponseBody> updateCategory(
            @Header("Authorization") String token,
            @Path("id") int categoryId,
            @FieldMap Map<String, String> fields
    );
}
