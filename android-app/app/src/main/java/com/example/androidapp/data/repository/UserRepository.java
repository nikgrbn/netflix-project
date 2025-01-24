package com.example.androidapp.data.repository;

import android.content.Context;
import android.net.Uri;


import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.api.UserApi;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.TokenResponse;
import com.example.androidapp.db.AppDatabase;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private final UserApi userApi;
    private final UserDao userDao;
    private final Context context;
    MutableLiveData<Boolean> isSignedIn = new MutableLiveData<>();

    MutableLiveData<Boolean> isSignedUp = new MutableLiveData<>();
    MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public UserRepository(Context context) {
        this.context = context;
        // Initialize Retrofit API
        userApi = RetrofitClient.getClient().create(UserApi.class);

        // Initialize Room Database
        userDao = AppDatabase.getInstance(context).userDao();
    }

    public LiveData<Boolean> getIsSignedIn() {
        return isSignedIn;
    }

    public LiveData<Boolean> getIsSignedUp() {
        return isSignedUp;
    }

    public MutableLiveData<String> getErrorMessage() {
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

                    // Deserialize user object
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

    public void signUp(String username, String password, String displayName, Uri selectedImageUri) {
        try {
            MultipartBody.Part body = null; // Initialize the body as null

            // Check if the image URI is provided
            if (selectedImageUri != null) {
                InputStream inputStream = context.getContentResolver().openInputStream(selectedImageUri);
                byte[] imageBytes = getBytesFromInputStream(inputStream);

                RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), imageBytes);
                body = MultipartBody.Part.createFormData("picture", "profile.jpg", requestFile);
            }

            Map<String, RequestBody> credentials = new HashMap<>();
            credentials.put("username", RequestBody.create(MediaType.parse("text/plain"), username));
            credentials.put("password", RequestBody.create(MediaType.parse("text/plain"), password));
            credentials.put("display_name", RequestBody.create(MediaType.parse("text/plain"), displayName));

            // Make the API call based on whether the picture is provided
            Call<ResponseBody> call;
            if (body != null) {
                call = userApi.signUp(body, credentials);
            } else {
                call = userApi.signUp(credentials); // Assuming there's a method for this case
            }

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        isSignedUp.postValue(true);
                    } else {
                        String error = "Sign up failed with error code: " + response.code();
                        try {
                            if (response.errorBody() != null) {
                                error += " - " + response.errorBody().string();
                            }
                        } catch (Exception e) {
                            error += " - Error reading errorBody.";
                        }
                        errorMessage.postValue(error);
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    errorMessage.postValue("Failed to connect: " + t.getMessage());
                }
            });
        } catch (FileNotFoundException e) {
            errorMessage.postValue("Image not found: " + e.getMessage());
        } catch (IOException e) {
            errorMessage.postValue("Failed to read image: " + e.getMessage());
        }
    }

    private byte[] getBytesFromInputStream(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();
        int bufferSize = 1024;
        byte[] buffer = new byte[bufferSize];

        int len;
        while ((len = inputStream.read(buffer)) != -1) {
            byteBuffer.write(buffer, 0, len);
        }
        return byteBuffer.toByteArray();
    }
}