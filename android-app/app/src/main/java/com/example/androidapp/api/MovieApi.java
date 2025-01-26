package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.data.model.response.MovieResponse;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface MovieApi {
    @GET("movies")
    Call<List<CategoryResponse>> getMoviesByCategory(
            @Header("Authorization") String token,
            @Header("User-Id") int userId
    );

    @GET("movies/{id}")
    Call<MovieResponse> getMovieById1(
            @Header("Authorization") String token,
            @Path("id") int movieId
    );

    @GET("movies/search/{query}")
    Call<List<Movie>> searchMovies(
            @Header("Authorization") String token,
            @Path("query") String query
    );

    @DELETE("movies/{id}")
    Call<ResponseBody> deleteMovie(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Path("id") int movieId
    );
    @POST("movies")
    @FormUrlEncoded
    Call<ResponseBody> addMovie(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @Field("name") String name,
            @Field("categories") String categories, // Comma-separated categories
            @Field("duration") int duration,       // Duration in minutes
            @Field("image") String image,          // Image URL or base64
            @Field("video") String video,          // Video URL or base64
            @Field("ageLimit") int ageLimit,       // Age limit
            @Field("description") String description // Movie description
    );


}