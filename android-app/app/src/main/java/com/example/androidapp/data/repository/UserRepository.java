package com.example.androidapp.data.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.api.UserApi;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.TokenResponse;
import com.example.androidapp.db.AppDatabase;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private final UserApi userApi;
    private final UserDao userDao;
    MutableLiveData<Boolean> isSignedIn = new MutableLiveData<>();
    MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public UserRepository(Context context) {
        // Initialize Retrofit API
        userApi = RetrofitClient.getClient().create(UserApi.class);

        // Initialize Room Database
        userDao = AppDatabase.getInstance(context).userDao();
    }

    public LiveData<Boolean> getIsSignedIn() {
        return isSignedIn;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void signIn(Map<String, String> credentials) {
        Call<TokenResponse> call = userApi.signIn(credentials);
        call.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                // Handle the response
                if (response.isSuccessful() && response.body() != null) {
                    TokenResponse tokenResponse = response.body();

                    // Serialize user object
                    User signedInUser = new User();
                    signedInUser.setId(tokenResponse.getId());
                    signedInUser.setUsername(tokenResponse.getUsername());
                    signedInUser.setPicture(tokenResponse.getPicture());
                    signedInUser.setDisplayName(tokenResponse.getDisplayName());
                    signedInUser.setToken(tokenResponse.getAuthToken());
                    signedInUser.setAdmin(tokenResponse.isAdmin());
                    signedInUser.setWatchedMovies(tokenResponse.getWatchedMovies());

                    // Save the user to the local db
                    saveUser(signedInUser);

                    // Update the UI
                    isSignedIn.postValue(true);
                }

                if (!response.isSuccessful()) {
                    errorMessage.postValue(response.message());
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable throwable) {
                // Handle the failure
                errorMessage.postValue(throwable.getMessage());
            }
        });
    }

    public void saveUser(User user) {
        AppDatabase.databaseWriteExecutor.execute(() -> userDao.insert(user));
    }
}