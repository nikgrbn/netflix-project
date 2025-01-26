package com.example.androidapp.api;

import okhttp3.ResponseBody;
import retrofit2.Call;
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
}
