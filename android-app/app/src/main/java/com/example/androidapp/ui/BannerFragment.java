package com.example.androidapp.ui;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.example.androidapp.R;
import com.google.android.material.button.MaterialButton;

public class BannerFragment extends Fragment {

    private ImageView bannerImage;
    private MaterialButton playButton, infoButton;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_banner, container, false);
        bannerImage = view.findViewById(R.id.image_banner);
        playButton = view.findViewById(R.id.btnPlay);
        infoButton = view.findViewById(R.id.btnInfo);

        return view;
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