package com.example.androidapp.ui;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.viewmodel.MovieInfoViewModel;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

public class MovieInfoFragment extends Fragment {

    private MovieInfoViewModel movieInfoViewModel;
    private TextView nameTextView;
    private TextView ageLimitTextView;
    private TextView durationTextView;
    private TextView descriptionTextView;
    private TextView categoriesTextView;

    private int movieId; // The ID of the movie to fetch

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_movie_info, container, false);

        // Initialize views
        nameTextView = view.findViewById(R.id.tvName);
        ageLimitTextView = view.findViewById(R.id.tvAgeLimit);
        durationTextView = view.findViewById(R.id.tvDuration);
        descriptionTextView = view.findViewById(R.id.tvDescription);
        categoriesTextView = view.findViewById(R.id.tvCategories);
        ImageButton btnClose = view.findViewById(R.id.btnClose);


        // Set click listener for close button
        btnClose.setOnClickListener(v -> {
            // Close the fragment immediately
            requireActivity().getSupportFragmentManager()
                    .beginTransaction()
                    .remove(this)
                    .commit();
        });


        // Retrieve movie ID from arguments
        if (getArguments() != null) {
            movieId = getArguments().getInt("movie_id");
        }

        // Initialize ViewModel with the Factory
        movieInfoViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(MovieInfoViewModel.class);

        // Observe the movie data
        movieInfoViewModel.getMovieById(movieId).observe(getViewLifecycleOwner(), this::populateMovieInfo);

        // Pass the movie ID to the VideoFragment
        Bundle args = new Bundle();
        args.putInt("movieId", movieId);

        // Create a new VideoFragment instance
        VideoFragment videoFragment = new VideoFragment();
        videoFragment.setArguments(args);

        // Replace the current fragment with the VideoFragment
        requireActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_video, videoFragment)
                .addToBackStack(null) // Add to backstack for proper navigation
                .commit();

        return view;
    }

    private void populateMovieInfo(Movie movie) {
        if (movie == null) return;

        nameTextView.setText(movie.getName());
        ageLimitTextView.setText("Age Limit: " + movie.getAgeLimit() + "+");
        durationTextView.setText("Duration: " + movie.getDuration() + " min");
        descriptionTextView.setText(movie.getDescription());

        String categories = movie.getCategories() != null ?
                String.join(", ", movie.getCategories().stream().map(c -> c.getName()).toArray(String[]::new))
                : "No categories available";

        categoriesTextView.setText("Categories: " + categories);
    }
}
