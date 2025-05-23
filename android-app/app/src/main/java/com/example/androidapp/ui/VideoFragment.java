package com.example.androidapp.ui;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.OptIn;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.MutableLiveData;
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
import com.example.androidapp.ui.home.HomeActivity;
import com.example.androidapp.viewmodel.VideoViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class VideoFragment extends Fragment {

    private PlayerView playerView;
    private ExoPlayer exoPlayer;
    private VideoViewModel videoViewModel;
    private MutableLiveData<Boolean> videoStarted = new MutableLiveData<>(false); // LiveData to track playback state
    private boolean isFromWatchActivity = false; // Flag to check the source

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Retrieve the movie ID and source flag from arguments
        Bundle args = getArguments();
        if (args != null) {
            int movieId = args.getInt("movieId");
            isFromWatchActivity = args.getBoolean("isFromWatchActivity", false);
            videoViewModel.fetchVideoUrl(movieId); // Fetch video URL for the movie
        }

        // Observe video playback state and notify the parent activity
        if (!isFromWatchActivity) { // Notify parent only if from HomeActivity
            videoStarted.observe(getViewLifecycleOwner(), started -> {
                if (started) {
                    // Notify the parent activity or fragment manager
                    ((HomeActivity) requireActivity()).onVideoStarted();
                }
            });
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

        if (isFromWatchActivity) {
            // Enable player controls for movie watching
            playerView.setUseController(true);
            playerView.setResizeMode(AspectRatioFrameLayout.RESIZE_MODE_FIT); // Fit screen for movie watching
        } else {
            // Disable player controls for banner preview
            playerView.setUseController(false);
            playerView.setResizeMode(AspectRatioFrameLayout.RESIZE_MODE_ZOOM); // Fill height and crop width
        }

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

            // Enable controls for WatchActivity
            if (isFromWatchActivity) {
                playerView.setUseController(true);
            } else {
                playerView.setUseController(false);
            }

            // Build the MediaItem
            MediaItem mediaItem = MediaItem.fromUri(videoUrl);

            // Set the media item to the player
            exoPlayer.setMediaItem(mediaItem);

            // Set playback settings
            if (isFromWatchActivity) {
                exoPlayer.setRepeatMode(Player.REPEAT_MODE_OFF); // Disable looping for movie watching
            } else {
                exoPlayer.setRepeatMode(Player.REPEAT_MODE_ALL); // Loop video for banner preview
            }

            // Add a listener to handle playback state
            exoPlayer.addListener(new Player.Listener() {
                @Override
                public void onPlaybackStateChanged(int playbackState) {
                    if (playbackState == Player.STATE_READY) {
                        // Video is ready and playback has started
                        videoStarted.postValue(true);
                        Log.d("VideoFragment", "Video playback started");
                    }
                }

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
        } else {
            exoPlayer.stop();
        }
    }


    @Override
    public void onStart() {
        super.onStart();
        if (exoPlayer != null) {
            exoPlayer.setPlayWhenReady(true);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (exoPlayer != null) {
            exoPlayer.setPlayWhenReady(false);
            exoPlayer.pause();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (exoPlayer != null) {
            exoPlayer.pause();
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
