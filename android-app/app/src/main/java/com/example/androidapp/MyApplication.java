package com.example.androidapp;

import android.app.Application;
import android.content.Context;

import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.db.AppDatabase;

public class MyApplication extends Application {
    private static MyApplication instance;
    private MovieRepository movieRepository;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        AppDatabase database = AppDatabase.getInstance(this); // Initialize Room database
        movieRepository = new MovieRepository(this); // Pass the Application context
    }//    }

    public static MyApplication getInstance() {
        return instance;
    }

    public static Context getContext() {
        return instance.getApplicationContext();
    }

    public MovieRepository getMovieRepository() {
        return movieRepository;
    }

//    public String getToken() {
//    }
}
