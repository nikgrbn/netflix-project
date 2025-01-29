package com.example.androidapp.data.repository;




import android.app.Application;
import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.CategoryApi;
import com.example.androidapp.api.MovieApi;
import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.data.dao.MovieDao;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.dao.CategoryDao;
import com.example.androidapp.data.model.entity.Category;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.db.AppDatabase;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import okhttp3.MediaType;
;
import okhttp3.RequestBody;


public class ConsoleRepository {
    private final MovieApi movieApi;

    private final CategoryApi categoryApi;
    private final MovieDao movieDao;
    private final UserDao userDao;

    private final CategoryDao categoryDao;
    private final Context context;

    MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    MutableLiveData<String> errorMessage = new MutableLiveData<>();
    MutableLiveData<Boolean> isDeleted = new MutableLiveData<>();

    MutableLiveData<Boolean> isAdded = new MutableLiveData<>();

    public ConsoleRepository(Application application) {
        movieApi = RetrofitClient.getClient().create(MovieApi.class);
        movieDao = AppDatabase.getInstance(application).movieDao();
        userDao = AppDatabase.getInstance(application).userDao();
        categoryApi = RetrofitClient.getClient().create(CategoryApi.class);
        categoryDao = AppDatabase.getInstance(application).categoryDao();
        this.context = application;
    }

    public LiveData<User> getUser() {
        return userDao.getUser(); // Expose userLiveData from Room
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public MutableLiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> isDeleted() {
        return isDeleted;
    }

    public LiveData<Boolean> isAdded() {
        return isAdded;
    }


    public LiveData<Boolean> deleteMovie(String token, int userId, int movieId) {
        isLoading.setValue(true); // Set loading state

        // Call the API to delete the movie
        movieApi.deleteMovie("Bearer " + token, userId, movieId).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                isLoading.postValue(false); // Stop loading state

                if (response.isSuccessful()) {// Delete the movie from Room database
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        movieDao.deleteMovieById(movieId); // Call the DAO method to delete from Room
                    });
                    isDeleted.postValue(true); // Update LiveData to indicate success
                } else {
                    errorMessage.postValue("Failed to delete movie: " + response.message());
                    isDeleted.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                isLoading.postValue(false); // Stop loading state
                errorMessage.postValue("Error deleting movie: " + t.getMessage());
                isDeleted.postValue(false);
            }
        });

        return isDeleted;
    }

    public LiveData<Boolean> deleteCategory(String token, int userId, int categoryId) {
        isLoading.setValue(true); // Set loading state

        // Call the API to delete the category
        categoryApi.deleteCategory("Bearer " + token, userId, categoryId).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                isLoading.postValue(false); // Stop loading state

                if (response.isSuccessful()) {
                    // Delete the category from Room database
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        categoryDao.deleteCategoryById(categoryId); // Call the DAO method to delete from Room
                    });
                    isDeleted.postValue(true); // Update LiveData to indicate success
                } else {
                    errorMessage.postValue("Failed to delete category: " + response.message());
                    isDeleted.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                isLoading.postValue(false); // Stop loading state
                errorMessage.postValue("Error deleting category: " + t.getMessage());
                isDeleted.postValue(false);
            }
        });

        return isDeleted;
    }

    public LiveData<Boolean> addCategory(String token, int userId, String name, boolean promoted) {
        isLoading.setValue(true); // Set loading state
        categoryApi.addCategory("Bearer " + token, userId, name, promoted).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                isLoading.postValue(false); // Stop loading state

                if (response.isSuccessful()) {
                    Log.d("ConsoleRepository", "Category added successfully");

                    // Insert the category into Room database
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        Category category = new Category();
                        category.setName(name);
                        category.setPromoted(promoted);
                        categoryDao.insertCategory(category); // Use the DAO to insert into Room
                    });
                    isAdded.postValue(true); // Indicate success
                } else {
                    Log.e("ConsoleRepository", "Failed to add category: " + response.message());
                    errorMessage.postValue("Failed to add category: " + response.message());
                    isAdded.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                isLoading.postValue(false); // Stop loading state
                Log.e("ConsoleRepository", "Error adding category", t);
                errorMessage.postValue("Error adding category: " + t.getMessage());
                isAdded.postValue(false);
            }
        });

        return isAdded;
    }

    public void addMovie(String token, int userId, String name, String[] categoriesArray, int duration,
                         Uri imageUri, Uri videoUri, int ageLimit, String description) {
        try {
            MultipartBody.Part imagePart = null; // Initialize image part as null
            MultipartBody.Part videoPart = null; // Initialize video part as null

            // Handle image upload
            if (imageUri != null) {
                InputStream imageStream = context.getContentResolver().openInputStream(imageUri);
                byte[] imageBytes = getBytesFromInputStream(imageStream);

                RequestBody imageRequest = RequestBody.create(MediaType.parse("image/*"), imageBytes);
                imagePart = MultipartBody.Part.createFormData("image", "movie_image.jpg", imageRequest);
            }

            // Handle video upload
            if (videoUri != null) {
                InputStream videoStream = context.getContentResolver().openInputStream(videoUri);
                byte[] videoBytes = getBytesFromInputStream(videoStream);

                RequestBody videoRequest = RequestBody.create(MediaType.parse("video/*"), videoBytes);
                videoPart = MultipartBody.Part.createFormData("video", "movie_video.mp4", videoRequest);
            }

            // Create the map for text fields
            Map<String, RequestBody> fields = new HashMap<>();
            fields.put("name", RequestBody.create(MediaType.parse("text/plain"), name));
            fields.put("duration", RequestBody.create(MediaType.parse("text/plain"), String.valueOf(duration)));
            fields.put("ageLimit", RequestBody.create(MediaType.parse("text/plain"), String.valueOf(ageLimit)));
            fields.put("description", RequestBody.create(MediaType.parse("text/plain"), description));

            for (int i = 0; i < categoriesArray.length; i++) {
                fields.put("categories[" + i + "]",
                        RequestBody.create(MediaType.parse("text/plain"), categoriesArray[i]));
            }

            // Make the API call
            Call<ResponseBody> call = movieApi.addMovie("Bearer " + token, userId, fields, imagePart, videoPart);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        isAdded.postValue(true);
                        Log.d("ConsoleRepository", "Movie added successfully");
                    } else {
                        String error = "Failed to add movie with error code: " + response.code();
                        try {
                            if (response.errorBody() != null) {
                                error += " - " + response.errorBody().string();
                            }
                        } catch (Exception e) {
                            error += " - Error reading errorBody.";
                        }
                        errorMessage.postValue(error);
                        Log.e("ConsoleRepository", error);
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    errorMessage.postValue("Failed to connect: " + t.getMessage());
                    Log.e("ConsoleRepository", "Error adding movie: " + t.getMessage());
                }
            });
        } catch (FileNotFoundException e) {
            errorMessage.postValue("File not found: " + e.getMessage());
        } catch (IOException e) {
            errorMessage.postValue("Failed to read file: " + e.getMessage());
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

    public void resetIsDeleted() {
        isDeleted.setValue(null);
    }

    public void resetIsAdded() {
        isAdded.setValue(null);
    }
}
