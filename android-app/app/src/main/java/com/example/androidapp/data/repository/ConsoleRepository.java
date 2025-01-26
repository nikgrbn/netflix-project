package com.example.androidapp.data.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


import android.app.Application;
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
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.db.AppDatabase;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ConsoleRepository {
    private final MovieApi movieApi;

    private final CategoryApi categoryApi;
    private final MovieDao movieDao;
    private final UserDao userDao;

    private final CategoryDao categoryDao;

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
    }

    public LiveData<User> getUser() {
        return userDao.getUser(); // Expose userLiveData from Room
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getErrorMessage() {
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

    public LiveData<Boolean> addMovie(String token, int userId, String name, @Nullable String categories,
                                      int duration, @Nullable String image, @Nullable String video,
                                      int ageLimit, @Nullable String description) {
        isLoading.setValue(true);
        movieApi.addMovie("Bearer " + token, userId, name, categories, duration, image, video, ageLimit, description)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        isLoading.postValue(false);
                        if (response.isSuccessful()) {
                            Log.d("ConsoleRepository", "Movie added successfully");
                            AppDatabase.databaseWriteExecutor.execute(() -> {
                                Movie movie = new Movie();
                                movie.setName(name);
                                if (categories != null) {
                                    List<Category> categoryList = new ArrayList<>();
                                    for (String categoryName : categories.split(",")) {
                                        Category category = new Category();
                                        category.setName(categoryName.trim());
                                        categoryList.add(category);
                                    }
                                    movie.setCategories(categoryList);
                                } else {
                                    movie.setCategories(null);
                                }
                                movie.setDuration(duration);
                                movie.setImage(image);
                                movie.setVideo(video);
                                movie.setAgeLimit(ageLimit);
                                movie.setDescription(description);
                                movieDao.insertMovie(movie);
                            });
                            isAdded.postValue(true);
                        } else {
                            Log.e("ConsoleRepository", "Failed to add movie: " + response.message());
                            errorMessage.postValue("Failed to add movie: " + response.message());
                            isAdded.postValue(false);
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        isLoading.postValue(false);
                        Log.e("ConsoleRepository", "Error adding movie", t);
                        errorMessage.postValue("Error adding movie: " + t.getMessage());
                        isAdded.postValue(false);
                    }
                });

        return isAdded;
        }
    public void resetIsDeleted() {
        isDeleted.setValue(null);
    }

    public void resetIsAdded() {
        isAdded.setValue(null);
    }
}
