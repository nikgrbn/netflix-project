package com.example.androidapp.ui;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.OptIn;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.AspectRatioFrameLayout;
import androidx.media3.ui.PlayerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.viewmodel.VideoViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class VideoFragment extends Fragment {

    private PlayerView playerView;
    private ExoPlayer exoPlayer;
    private VideoViewModel videoViewModel;

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Retrieve the movie ID from arguments
        Bundle args = getArguments();
        if (args != null) {
            int movieId = args.getInt("movieId");
            videoViewModel.fetchVideoUrl(movieId); // Fetch video URL for the movie
        }
    }

    @OptIn(markerClass = UnstableApi.class)
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_video, container, false);

        // Initialize ViewModel
        videoViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(VideoViewModel.class);

        // Initialize PlayerView
        playerView = view.findViewById(R.id.player_view);
        playerView.setUseController(false); // Disable player controls
        playerView.setResizeMode(AspectRatioFrameLayout.RESIZE_MODE_ZOOM); // Fill height and crop width

        // Observe the video URL
        videoViewModel.getVideoUrl().observe(getViewLifecycleOwner(), videoUrl -> {
            if (videoUrl != null) {
                Log.d("VideoFragment", "Video URL: " + videoUrl);
                initializePlayer(videoUrl);
            }
        });

        return view;
    }

    private void initializePlayer(String videoUrl) {
        if (exoPlayer == null) {
            // Create the ExoPlayer instance
            exoPlayer = new ExoPlayer.Builder(requireContext()).build();

            // Attach the player to the PlayerView
            playerView.setPlayer(exoPlayer);

            // Build the MediaItem
            MediaItem mediaItem = MediaItem.fromUri(videoUrl);

            // Set the media item to the player
            exoPlayer.setMediaItem(mediaItem);

            // Set the aspect ratio
            exoPlayer.setRepeatMode(Player.REPEAT_MODE_ALL); // Loop video

            // Add a listener to handle playback errors and retries
            exoPlayer.addListener(new Player.Listener() {
                @Override
                public void onPlayerError(@NonNull PlaybackException error) {
                    Log.e("VideoFragment", "Playback error: " + error.getMessage());
                    exoPlayer.prepare(); // Retry playback on error
                    exoPlayer.play();
                }
            });

            // Prepare and play the video
            exoPlayer.prepare();
            exoPlayer.play();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (exoPlayer != null) {
            exoPlayer.play();
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (exoPlayer != null) {
            exoPlayer.release();
            exoPlayer = null;
        }
    }
}