package com.example.androidapp.viewmodel.home;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.Category;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.model.response.CategoryResponse;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.data.repository.UserRepository;

import java.util.List;

public class HomeViewModel extends ViewModel {
    private final MovieRepository repository;

    private final LiveData<User> userLiveData;
    private final LiveData<List<Category>> categoriesLiveData;
    private final LiveData<Boolean> isLoading;
    private final LiveData<String> errorMessage;
    private final LiveData<List<Movie>> searchResults;

    public HomeViewModel(MovieRepository repository) {
        this.repository = repository;

        this.userLiveData = repository.getUser();
        this.categoriesLiveData = repository.getCategories();
        this.isLoading = repository.getIsLoading();
        this.errorMessage = repository.getErrorMessage();
        this.searchResults = repository.getSearchResults();
    }

    public LiveData<User> getUser() {
        return userLiveData;
    }
    public LiveData<List<Category>> getCategories() {
        return categoriesLiveData;
    }
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }
    public LiveData<Boolean> isLoading() {
        return isLoading;
    }
    public LiveData<List<Movie>> getSearchResults() {
        return searchResults;
    }

    public void searchMovies(String query) {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                repository.searchMovies(token, query);
            }
        });
    }
    public void fetchMoviesByCategory() {
        userLiveData.observeForever(user -> {
            if (user != null) {
                String token = user.getToken();
                int userId = user.getId();
                repository.getMoviesByCategory(token, userId);
            }
        });
    }
}