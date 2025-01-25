package com.example.androidapp.viewmodel;

import android.annotation.SuppressLint;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.MovieRepository;

public class ConsoleViewModel extends ViewModel {

    private final MovieRepository movieRepository;

    private final LiveData<User> userLiveData;
    private final LiveData<Boolean> isDeleted;
    private final LiveData<Boolean> isLoading;
    private final LiveData<String> errorMessage;

    public ConsoleViewModel(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
        this.userLiveData = movieRepository.getUser();
        this.isLoading = movieRepository.getIsLoading();
        this.errorMessage = movieRepository.getErrorMessage();
        this.isDeleted = movieRepository.isDeleted();
    }

    public LiveData<User> getUser() {
        return userLiveData;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<Boolean> isDeleted() {
        return isDeleted;
    }

    public void deleteMovie(int movieId) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                movieRepository.deleteMovie(token, userId, movieId);
            }
        });
    }
}
