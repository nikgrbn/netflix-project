package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.data.model.response.MovieResponse;

import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
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
    @Multipart
    @POST("movies")
    Call<ResponseBody> addMovie(
            @Header("Authorization") String token,
            @Header("User-Id") int userId,
            @PartMap Map<String, RequestBody> fields,
            @Part MultipartBody.Part image,
            @Part MultipartBody.Part video
    );



}