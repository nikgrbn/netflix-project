package com.example.androidapp.viewmodel;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.data.repository.RecommendRepository;

public class WatchViewModel extends AndroidViewModel {

    private final RecommendRepository recommendRepository;
    private final LiveData<User> userLiveData;

    // Flag to track if the recommendation was already added
    private boolean isRecommendationAdded = false;

    public WatchViewModel(@NonNull Application application) {
        super(application);
        recommendRepository = new RecommendRepository(application);
        userLiveData = recommendRepository.getUser();
    }

    public void addRecommendation(int movieId) {
        // Avoid setting observers that persist unnecessarily
        userLiveData.observeForever(new Observer<User>() {
            @Override
            public void onChanged(User user) {
                if (user != null) {
                    String token = user.getToken();
                    int userId = user.getId();
                    Log.d("WatchViewModel", "Adding recommendation for movieId: " + movieId);
                    recommendRepository.addRecommendation(token, userId, movieId);
                }

                // Remove the observer to prevent further triggers
                userLiveData.removeObserver(this);
            }
        });
    }
}