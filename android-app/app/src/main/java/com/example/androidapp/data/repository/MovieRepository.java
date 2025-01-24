package com.example.androidapp.data.repository;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.MovieApi;
import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.data.dao.MovieDao;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.db.AppDatabase;

import java.io.Console;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieRepository {

    private final MovieApi movieApi;
    private final MovieDao movieDao;
    private final UserDao userDao;

    MutableLiveData<Movie> bannerMovie = new MutableLiveData<>();
    MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public MovieRepository(Application application) {
        // Use the application context
        movieApi = RetrofitClient.getClient().create(MovieApi.class);
        movieDao = AppDatabase.getInstance(application).movieDao();
        userDao = AppDatabase.getInstance(application).userDao();
    }

    public LiveData<User> getUser() {
        return userDao.getUser(); // Expose userLiveData from Room
    }
    public LiveData<Movie> getBannerMovie() {
        return bannerMovie;
    }
    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public String getVideoUrl(int movieId) {
        // Ensure BASE_URL ends with a slash
        String baseUrl = RetrofitClient.BASE_URL.endsWith("/") ? RetrofitClient.BASE_URL : RetrofitClient.BASE_URL + "/";

        // Construct the full video URL
        return baseUrl + "movies/" + movieId + "/video";
    }

    public void getMoviesByCategory(String token, int userId) {
        isLoading.setValue(true);

        // Call the API
        movieApi.getMoviesByCategory("Bearer " + token, userId).enqueue(new Callback<List<CategoryResponse>>() {
            @Override
            public void onResponse(Call<List<CategoryResponse>> call, Response<List<CategoryResponse>> response) {
                // Handle the response
                if (response.isSuccessful() && response.body() != null) {
                    // Get the list of categories
                    List<CategoryResponse> categories = response.body();

                    // Save movies into the database asynchronously
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        for (CategoryResponse category : categories) {
                            movieDao.insertMovies(category.getMovies());
                        }

                        // Fetch a random movie and post value
                        Movie randomMovie = movieDao.getRandomMovieSync();
                        bannerMovie.postValue(randomMovie);
                        isLoading.postValue(false);
                    });
                }
                // Handle the error
                else {
                    errorMessage.setValue(response.message());
                    isLoading.setValue(false);
                }
            }

            @Override
            public void onFailure(Call<List<CategoryResponse>> call, Throwable throwable) {
                // Handle the error
                isLoading.setValue(false);
                errorMessage.setValue(throwable.getMessage());
            }
        });
    }
}
