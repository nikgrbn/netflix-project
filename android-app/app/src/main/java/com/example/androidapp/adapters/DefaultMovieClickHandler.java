package com.example.androidapp.adapters;

import android.os.Bundle;

import androidx.fragment.app.FragmentManager;

import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.ui.MovieInfoFragment;

public class DefaultMovieClickHandler implements MovieClickHandler {
    private FragmentManager fragmentManager;
    private int containerId;

    public DefaultMovieClickHandler(FragmentManager fragmentManager, int containerId) {
        this.fragmentManager = fragmentManager;
        this.containerId = containerId;
    }

    @Override
    public void onMovieClicked(Movie movie) {
        // Create a new instance of MovieInfoFragment
        MovieInfoFragment movieInfoFragment = new MovieInfoFragment();

        // Create a bundle to pass the movie ID and other data
        Bundle args = new Bundle();
        movieInfoFragment.setArguments(args);

        // Navigate to MovieInfoFragment
        fragmentManager.beginTransaction()
                .replace(containerId, movieInfoFragment)
                .addToBackStack(null)
                .commit();
    }
}
