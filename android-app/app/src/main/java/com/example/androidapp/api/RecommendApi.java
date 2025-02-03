package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.Movie;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface RecommendApi {
    @POST("movies/{id}/recommend")
    Call<ResponseBody> addRecommendation(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Path("id") int movieId
    );

    @GET("movies/{id}/recommend")
    Call<List<Movie>> getRecommendation(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Path("id") int movieId
    );
}
