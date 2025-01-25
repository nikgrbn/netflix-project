package com.example.androidapp.viewmodel.home;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.viewmodel.VideoViewModel;

public class ViewModelFactory implements ViewModelProvider.Factory {
    private final MovieRepository repository;

    public ViewModelFactory(MovieRepository repository) {
        this.repository = repository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(HomeViewModel.class)) {
            return (T) new HomeViewModel(repository);
        } else if (modelClass.isAssignableFrom(BannerViewModel.class)) {
            return (T) new BannerViewModel(repository);
        } else if (modelClass.isAssignableFrom(VideoViewModel.class)) {
            return (T) new VideoViewModel(repository);
        }
        throw new IllegalArgumentException("Unknown ViewModel class");
    }
}