package com.example.androidapp.ui.home;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.ui.VideoFragment;
import com.example.androidapp.viewmodel.home.BannerViewModel;

import com.example.androidapp.viewmodel.home.ViewModelFactory;
import com.google.android.material.button.MaterialButton;

public class BannerFragment extends Fragment {

    private View view;
    private TextView title, description;
    private MaterialButton playButton, infoButton;
    private BannerViewModel bannerViewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_banner, container, false);

        // Get the shared repository instance
        MovieRepository sharedRepository = ((MyApplication) requireActivity().getApplication()).getMovieRepository();

        // Initialize ViewModel
        bannerViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(BannerViewModel.class);

        // Initialize UI components
        title = view.findViewById(R.id.tvTitle);
        description = view.findViewById(R.id.tvDescription);
        playButton = view.findViewById(R.id.btnPlay);
        infoButton = view.findViewById(R.id.btnInfo);

        // Show the saved banner movie initially
        bannerViewModel.getBannerMovie().observe(getViewLifecycleOwner(), movie -> {
            if (movie != null) {
                updateBannerUI(movie);
            }
        });
        return view;
    }

    private void updateBannerUI(Movie movie) {
        // Pass the movie ID to the VideoFragment
        Bundle args = new Bundle();
        args.putInt("movieId", movie.getId());

        // Create a new VideoFragment instance
        VideoFragment videoFragment = new VideoFragment();
        videoFragment.setArguments(args);

        // Replace the current fragment with the VideoFragment
        requireActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_video, videoFragment)
                .addToBackStack(null) // Add to backstack for proper navigation
                .commit();

        // Load movie details
        title.setText(movie.getName());
        description.setText(movie.getDescription());

        playButton.setOnClickListener(v -> {
            // Play movie logic
        });

        infoButton.setOnClickListener(v -> {
            // Show movie info logic
        });
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }
}