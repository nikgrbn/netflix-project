package com.example.androidapp.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.data.repository.MovieRepository;

public class VideoViewModel extends ViewModel {

    private final MovieRepository repository;
    private final MutableLiveData<String> videoUrl = new MutableLiveData<>();

    public VideoViewModel(MovieRepository repository) {
        this.repository = repository;
    }

    public LiveData<String> getVideoUrl() {
        return videoUrl;
    }

    public void fetchVideoUrl(int movieId) {
        // Build the video URL using the movie ID
        videoUrl.setValue(repository.getVideoUrl(movieId));
    }
}
