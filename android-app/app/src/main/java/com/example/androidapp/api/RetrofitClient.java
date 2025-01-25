package com.example.androidapp.api;

import android.util.Log;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {

    public static final String BASE_URL = MyApplication.getContext().getString(R.string.BaseUrlNikitaLaptop);

    private static Retrofit retrofit = null;

    public static Retrofit getClient() {
        Log.d("Retrofit", "Base URL: " + BASE_URL);
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}