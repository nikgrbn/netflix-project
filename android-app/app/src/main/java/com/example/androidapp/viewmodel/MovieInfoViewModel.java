package com.example.androidapp.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.data.repository.RecommendRepository;

import java.util.List;

public class MovieInfoViewModel extends ViewModel {

    private final MovieRepository movieRepository;

    private final LiveData<User> userLiveData;
    private final LiveData<List<Movie>> recommendations;

    public MovieInfoViewModel(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;

        this.userLiveData = movieRepository.getUser();
        recommendations = movieRepository.getRecommendations();
    }

    public LiveData<Movie> getMovieById(int id) {
        return movieRepository.getMovieById(id);
    }

    public LiveData<List<Movie>> getRecommendations() {
        return recommendations;
    }

    public void fetchRecommendations(int movieId) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                movieRepository.fetchRecommendations(token, userId, movieId);
            }
        });
    }
}
