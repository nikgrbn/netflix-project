package com.example.androidapp.data.repository;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.CategoryApi;
import com.example.androidapp.api.MovieApi;
import com.example.androidapp.api.RecommendApi;
import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.data.dao.CategoryDao;
import com.example.androidapp.data.dao.MovieDao;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.model.entity.Category;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.db.AppDatabase;

import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieRepository {

    private final MovieApi movieApi;
    private final CategoryApi categoryApi;;
    private final RecommendApi recommendApi;
    private final MovieDao movieDao;
    private final UserDao userDao;
    private final CategoryDao categoryDao;

    MutableLiveData<List<Movie>> recommendations = new MutableLiveData<>();
    MutableLiveData<List<Category>> allCategories = new MutableLiveData<>();
    MutableLiveData<List<Category>> homeCategories = new MutableLiveData<>();
    MutableLiveData<Movie> bannerMovie = new MutableLiveData<>();
    MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    MutableLiveData<String> errorMessage = new MutableLiveData<>();
    MutableLiveData<List<Movie>> searchResults = new MutableLiveData<>();

    public MovieRepository(Application application) {
        // Use the application context
        movieApi = RetrofitClient.getClient().create(MovieApi.class);
        categoryApi = RetrofitClient.getClient().create(CategoryApi.class);
        recommendApi = RetrofitClient.getClient().create(RecommendApi.class);

        movieDao = AppDatabase.getInstance(application).movieDao();
        userDao = AppDatabase.getInstance(application).userDao();
        categoryDao = AppDatabase.getInstance(application).categoryDao();
    }

    public LiveData<List<Movie>> getRecommendations() {
        return recommendations;
    }

    public LiveData<User> getUser() {
        return userDao.getUser(); // Expose userLiveData from Room
    }
    public LiveData<Movie> getMovieById(int id) {
        return movieDao.getMovieById(id);
    }
    public LiveData<List<Category>> getAllCategories() {
        return allCategories;
    }
    public LiveData<List<Category>> getHomeCategories() {
        return homeCategories;
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
    public LiveData<List<Movie>> getSearchResults() {
        return searchResults;
    }

    public void fetchRecommendations(String token, int userId, int movieId) {
        recommendApi.getRecommendation("Bearer " + token, userId, movieId).enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (!response.isSuccessful() || response.body() == null) {
                    Log.e("RecommendRepository", "Failed to fetch recommendations: " + response.message());
                    return;
                }

                // Save recommendations to Room
                AppDatabase.databaseWriteExecutor.execute(() -> {
                    movieDao.insertMovies(response.body());
                    recommendations.postValue(response.body());
                });
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable throwable) {
                Log.e("RecommendRepository", "Failed to fetch recommendations", throwable);
            }
        });
    }

    public String getVideoUrl(int movieId) {
        // Ensure BASE_URL ends with a slash
        String baseUrl = RetrofitClient.BASE_URL.endsWith("/") ? RetrofitClient.BASE_URL : RetrofitClient.BASE_URL + "/";

        // Construct the full video URL
        return baseUrl + "movies/" + movieId + "/video";
    }

    public void searchMovies(String token, String query) {
        isLoading.setValue(true);

        movieApi.searchMovies("Bearer " + token, query).enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Movie> movies = response.body();
                    movieDao.insertMovies(movies);

                    searchResults.postValue(movies);
                    isLoading.postValue(false);
                } else {
                    errorMessage.setValue(response.message());
                    isLoading.setValue(false);
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable throwable) {
                errorMessage.setValue(throwable.getMessage());
                isLoading.setValue(false);
            }
        });
    }

    public void getAllCategories(String token) {
        isLoading.setValue(true);

        categoryApi.getCategories("Bearer " + token).enqueue(new Callback<List<CategoryResponse>>() {
            @Override
            public void onResponse(Call<List<CategoryResponse>> call, Response<List<CategoryResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        List<CategoryResponse> categoryResponses = response.body();

                        // Save movies and categories into the database
                        for (CategoryResponse categoryResponse : categoryResponses) {
                            // Save movies
                            movieDao.insertMovies(categoryResponse.getMovies());
                        }

                        // Fetch movies grouped by category
                        List<Category> categoriesWithMovies = new ArrayList<>();
                        for (CategoryResponse categoryResponse : categoryResponses) {
                            Category category = new Category();
                            category.id = categoryResponse.getCategoryId();
                            category.name = categoryResponse.getCategoryName();
                            category.promoted = categoryResponse.getPromoted();
                            category.setMovies(categoryResponse.getMovies());
                            categoriesWithMovies.add(category);
                        }
                        // Save categories to Room
                        categoryDao.insertCategories(categoriesWithMovies);

                        // Post the value to LiveData
                        allCategories.postValue(categoriesWithMovies);
                        isLoading.postValue(false);
                    });
                } else {
                    errorMessage.setValue(response.message());
                    isLoading.setValue(false);
                }
            }

            @Override
            public void onFailure(Call<List<CategoryResponse>> call, Throwable throwable) {
                errorMessage.setValue(throwable.getMessage());
                isLoading.setValue(false);
            }
        });
    }

    public void getMoviesByCategory(String token, int userId) {
        isLoading.setValue(true);

        // Load categories from Room
        AppDatabase.databaseWriteExecutor.execute(() -> {
            List<Category> cachedCategories = loadPromotedCategoriesFromRoom();
            homeCategories.postValue(cachedCategories);
        });

        // Fetch movies from the API
        movieApi.getMoviesByCategory("Bearer " + token, userId).enqueue(new Callback<List<CategoryResponse>>() {
            @Override
            public void onResponse(Call<List<CategoryResponse>> call, Response<List<CategoryResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<CategoryResponse> categoryResponses = response.body();

                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        // Save movies and categories into the database
                        for (CategoryResponse categoryResponse : categoryResponses) {
                            // Save movies
                            movieDao.insertMovies(categoryResponse.getMovies());
                        }

                        // Fetch a random movie and post value
                        Movie randomMovie = movieDao.getRandomMovieSync();
                        bannerMovie.postValue(randomMovie);

                        // Fetch movies grouped by category
                        List<Category> categoriesWithMovies = new ArrayList<>();
                        for (CategoryResponse categoryResponse : categoryResponses) {
                            Category category = new Category();
                            category.id = categoryResponse.getCategoryId();
                            category.name = categoryResponse.getCategoryName();
                            category.promoted = true;

                            // Special case: "Previous movies you have watched"
                            if (category.id == 0) {
                                category.setMovies(categoryResponse.getMovies()); // Directly assign movies
                            } else {
                                // Normal case: Fetch movies by category ID
                                List<Movie> movies = movieDao.getMoviesByCategory(category.id);
                                category.setMovies(movies);
                            }
                            categoriesWithMovies.add(category);
                        }
                        // Save categories to Room
                        categoryDao.insertCategories(categoriesWithMovies);

                        // Post the value to LiveData
                        homeCategories.postValue(categoriesWithMovies);
                        isLoading.postValue(false);
                    });
                } else {
                    errorMessage.setValue(response.message());
                    isLoading.setValue(false);
                }
            }

            @Override
            public void onFailure(Call<List<CategoryResponse>> call, Throwable throwable) {
                errorMessage.setValue(throwable.getMessage());
                isLoading.setValue(false);
            }
        });
    }

    private List<Category> loadPromotedCategoriesFromRoom() {
        List<Category> categoriesWithMovies = new ArrayList<>();
        List<Category> categories = categoryDao.getPromotedCategories();

        for (Category category : categories) {
            if (!(category.id == 0)) {
                List<Movie> movies = movieDao.getMoviesByCategory(category.id);
                category.setMovies(movies);
                categoriesWithMovies.add(category);
            }
        }
        return categoriesWithMovies;
    }
}
