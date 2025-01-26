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
import com.example.androidapp.db.AppDatabase;

import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RecommendRepository {

    private final RecommendApi recommendApi;
    private final MovieDao movieDao;
    private final CategoryDao categoryDao;
    private final UserDao userDao;

    public RecommendRepository(Application application) {
        // Use the application context
        recommendApi = RetrofitClient.getClient().create(RecommendApi.class);

        movieDao = AppDatabase.getInstance(application).movieDao();
        categoryDao = AppDatabase.getInstance(application).categoryDao();
        userDao = AppDatabase.getInstance(application).userDao();
    }

    public LiveData<User> getUser() {
        return userDao.getUser();
    }

    public void addRecommendation(String token, int userId, int movieId) {
        recommendApi.addRecommendation("Bearer " + token, userId, movieId).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (!response.isSuccessful() || response.body() == null) {
                    Log.e("RecommendRepository", "Failed to add recommendation: " + response.message());
                    return;
                }

                // Update room database
                Movie movie = movieDao.getMovieById(movieId).getValue();
                Category category = categoryDao.getCategoryById(0);

                Log.d("RecommendRepository", "Succeded recommendation for movieId: " + movieId);

                List<Movie> movies = category.getMovies();
                if (movies == null) {
                    movies = new ArrayList<Movie>();
                }
                movies.add(movie);

                category.setMovies(movies);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable throwable) {
                Log.e("RecommendRepository", "Failed to add recommendation", throwable);
            }
        });
    }
}
