package com.example.androidapp.viewmodel.home;

import android.app.Application;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.data.repository.MovieRepository;

import java.util.List;

public class HomeViewModel extends ViewModel {
    private final MovieRepository repository;
    private final LiveData<Boolean> isLoading;
    private final LiveData<String> errorMessage;

    public HomeViewModel(MovieRepository repository) {
        this.repository = repository;
        this.isLoading = repository.getIsLoading();
        this.errorMessage = repository.getErrorMessage();
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> isLoading() {
        return isLoading;
    }

    public void fetchMoviesByCategory(String token, int userId) {
        repository.getMoviesByCategory(token, userId);
    }
}