package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.TokenResponse;


import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface UserApi {
    @POST("tokens")
    Call<TokenResponse> signIn(@Body Map<String, String> credentials);
}