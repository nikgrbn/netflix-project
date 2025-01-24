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

import com.bumptech.glide.Glide;
import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.data.repository.MovieRepository;
import com.example.androidapp.viewmodel.home.BannerViewModel;

import com.example.androidapp.viewmodel.home.ViewModelFactory;
import com.google.android.material.button.MaterialButton;

public class BannerFragment extends Fragment {

    private ImageView bannerImage;
    private MaterialButton playButton, infoButton;
    private BannerViewModel bannerViewModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_banner, container, false);

        // Get the shared repository instance
        MovieRepository sharedRepository = ((MyApplication) requireActivity().getApplication()).getMovieRepository();

        // Initialize ViewModel
        bannerViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(BannerViewModel.class);

        bannerImage = view.findViewById(R.id.image_banner);
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
        String normalizedUrl = movie.image.replace("\\", "/"); // Replace backslashes with forward slashes

        Glide.with(requireContext())
                .load(normalizedUrl)
                .into(bannerImage);

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

        // Load the banner image (example with Glide)
        Glide.with(requireContext())
                .load("https://img.freepik.com/premium-photo/movie-poster-design_841014-8862.jpg")
                .into(bannerImage);

        // Set button actions
        playButton.setOnClickListener(v -> {
            // Play movie logic
        });

        infoButton.setOnClickListener(v -> {
            // Show movie info logic
        });
    }
}