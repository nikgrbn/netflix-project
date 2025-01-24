package com.example.androidapp.viewmodel.home;


import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.repository.MovieRepository;

public class BannerViewModel extends ViewModel {

    private MovieRepository repository;

    private LiveData<Movie> bannerMovie;

    public BannerViewModel(MovieRepository repository) {
        super();
        this.repository = repository;
        this.bannerMovie = repository.getBannerMovie();
    }

    public LiveData<Movie> getBannerMovie() {
        return bannerMovie;
    }
}