package com.example.androidapp.viewmodel;

import android.annotation.SuppressLint;
import android.app.Application;
import android.net.Uri;

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
    private final LiveData<Boolean> isDeleted;
    private final LiveData<Boolean> isAdded;
    private final LiveData<Boolean> isLoading;
    private final MutableLiveData<String> errorMessage;

    public ConsoleViewModel(@NonNull Application application) {
        super(application);
        consoleRepository = new ConsoleRepository(application);

        this.userLiveData = consoleRepository.getUser();
        this.isLoading = consoleRepository.getIsLoading();
        this.errorMessage = consoleRepository.getErrorMessage();
        this.isDeleted = consoleRepository.isDeleted();
        this.isAdded = consoleRepository.isAdded();
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

    public LiveData<Boolean> isAdded() {
        return isAdded;
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

    public void addCategory(String name, boolean promoted) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                consoleRepository.addCategory(token, userId, name, promoted);
            }
        });
    }

    public void addMovie(String name, String[] categories, int duration, Uri imageUri, Uri videoUri, int ageLimit, String description) {
        // Validating required fields
        if (name == null || name.isEmpty()) {
            errorMessage.postValue("Movie name cannot be empty.");
            return;
        }

        // Checking if user data exists
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();

                // Calling repository to handle movie addition
                consoleRepository.addMovie(token, userId, name, categories, duration, imageUri, videoUri, ageLimit, description);
            } else {
                errorMessage.postValue("User not found. Please log in.");
            }
        });
    }

    public void resetIsDeleted() {
        consoleRepository.resetIsDeleted();
    }

    public void resetIsAdded() {
        consoleRepository.resetIsAdded();
    }
}

