package com.example.androidapp.viewmodel.home;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.data.repository.MovieRepository;

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
        }
        throw new IllegalArgumentException("Unknown ViewModel class");
    }
}