package com.example.androidapp.api;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.TokenResponse;


import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.PartMap;

public interface UserApi {
    @POST("tokens")
    Call<TokenResponse> signIn(@Body Map<String, String> credentials);

    @Multipart
    @POST("users")
    Call<ResponseBody> signUp(
            @Part MultipartBody.Part picture,
            @PartMap Map<String, RequestBody> credentials
    );
}