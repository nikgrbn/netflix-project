package com.example.androidapp.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.MovieRepository;

public class MovieInfoViewModel extends ViewModel {

    private final MovieRepository movieRepository;

    public MovieInfoViewModel(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public LiveData<Movie> getMovieById(int id) {
        return movieRepository.getMovieById(id);
    }
}
