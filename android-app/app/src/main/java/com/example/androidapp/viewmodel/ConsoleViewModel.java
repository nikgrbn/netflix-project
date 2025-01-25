package com.example.androidapp.viewmodel;

import android.annotation.SuppressLint;
import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.ConsoleRepository;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.data.repository.UserRepository;

public class ConsoleViewModel extends AndroidViewModel {

    private final ConsoleRepository consoleRepository;

    private final LiveData<User> userLiveData;
    private final LiveData<Boolean> isMovieDeleted;
    private final LiveData<Boolean> isLoading;
    private final LiveData<String> errorMessage;

    public ConsoleViewModel(@NonNull Application application) {
        super(application);
        consoleRepository = new ConsoleRepository(application);

        this.userLiveData = consoleRepository.getUser();
        this.isLoading = consoleRepository.getIsLoading();
        this.errorMessage = consoleRepository.getErrorMessage();
        this.isMovieDeleted = consoleRepository.isDeleted();
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

    public LiveData<Boolean> isMovieDeleted() {
        return isMovieDeleted;
    }

    public void deleteMovie(int movieId) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                consoleRepository.deleteMovie(token, userId, movieId);
            }
        });
    }

    public void deleteCategory(int categoryId) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                consoleRepository.deleteCategory(token, userId,categoryId);
            }
        });
    }
    public void resetIsMovieDeleted() {
        consoleRepository.resetIsDeleted();
    }

    public void resetIsCategoryDeleted() {
        consoleRepository.resetIsDeleted();
    }
}
