package com.example.androidapp.viewmodel.home;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.MovieRepository;

public class HeaderViewModel extends ViewModel {
    private MovieRepository repository;
    private final LiveData<User> userLiveData;

    public HeaderViewModel(MovieRepository repository) {
        this.repository = repository;
        this.userLiveData = repository.getUser();
    }

    public LiveData<User> getUser() {
        return userLiveData;
    }
}
