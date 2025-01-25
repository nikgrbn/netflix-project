package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.response.CategoryResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface MovieApi {
    @GET("movies")
    Call<List<CategoryResponse>> getMoviesByCategory(
            @Header("Authorization") String token,
            @Header("User-Id") int userId
    );

    // New method for searching movies
    @GET("movies/search/{query}")
    Call<List<Movie>> searchMovies(
            @Path("query") String query,
            @Header("Authorization") String token
    );
}