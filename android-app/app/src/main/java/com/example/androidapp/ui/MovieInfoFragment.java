package com.example.androidapp.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
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
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.adapters.CategoryAdapter;
import com.example.androidapp.adapters.DefaultMovieClickHandler;
import com.example.androidapp.adapters.MovieAdapter;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.viewmodel.MovieInfoViewModel;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;

public class MovieInfoFragment extends Fragment {

    private MovieInfoViewModel movieInfoViewModel;
    private TextView nameTextView, ageLimitTextView, durationTextView, descriptionTextView, categoriesTextView;
    private MaterialButton playButton;
    private RecyclerView rvRecommendations;

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
        playButton = view.findViewById(R.id.btnPlay);
        rvRecommendations = view.findViewById(R.id.rvRecommendations);

        // Set click listener for close button
        btnClose.setOnClickListener(v -> {
            // Close the fragment
            requireActivity().getSupportFragmentManager()
                    .beginTransaction()
                    .remove(this)
                    .commit();
        });

        // Retrieve movie ID from arguments
        if (getArguments() != null && getArguments().containsKey("movieId")) {
            movieId = getArguments().getInt("movieId");
        } else {
            return view;
        }

        // Initialize ViewModel with Factory
        movieInfoViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(MovieInfoViewModel.class);

        // Set up RecyclerView with LayoutManager
        rvRecommendations.setLayoutManager(new LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false));

        // Initialize the Adapter
        MovieAdapter movieAdapter = new MovieAdapter(
                new ArrayList<>(),
                new DefaultMovieClickHandler(requireActivity().getSupportFragmentManager(), R.id.content_container)
        );
        rvRecommendations.setAdapter(movieAdapter);

        // Observe the movie data and update UI
        movieInfoViewModel.getMovieById(movieId).observe(getViewLifecycleOwner(), this::populateMovieInfo);

        // Observe recommendations and update the RecyclerView
        movieInfoViewModel.getRecommendations().observe(getViewLifecycleOwner(), movies -> {
            if (movies == null || movies.isEmpty()) {
                ((TextView) view.findViewById(R.id.tvRecommendations)).setText("No recommendations available");
            } else {
                ((TextView) view.findViewById(R.id.tvRecommendations)).setText("Recommendations");
                movieAdapter.updateMovies(movies); // Update the adapter's data
            }
        });
        movieInfoViewModel.fetchRecommendations(movieId);

        // Pass the movie ID to the VideoFragment
        Bundle args = new Bundle();
        args.putInt("movieId", movieId);

        // Create a new VideoFragment instance
        VideoFragment videoFragment = new VideoFragment();
        videoFragment.setArguments(args);

        getChildFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_video_info, videoFragment)
                .commit();

        return view;
    }

    private void populateMovieInfo(Movie movie) {
        if (movie == null) return;

        nameTextView.setText(movie.getName());
        ageLimitTextView.setText( + movie.getAgeLimit() + "+");
        durationTextView.setText( + movie.getDuration() + " min");
        descriptionTextView.setText(movie.getDescription());

        String categories = movie.getCategories() != null ?
                String.join(", ", movie.getCategories().stream().map(c -> c.getName()).toArray(String[]::new))
                : "No categories available";

        categoriesTextView.setText("Categories: " + categories);

        playButton.setOnClickListener(v -> {
            // Use requireContext() to create the intent
            Intent intent = new Intent(requireContext(), WatchActivity.class);

            // Pass the movieId as an extra
            intent.putExtra("movieId", movie.getId());

            // Start the activity
            startActivity(intent);
        });
    }
}
