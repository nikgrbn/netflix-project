package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.data.repository.RecommendRepository;
import com.example.androidapp.ui.home.HomeActivity;
import com.example.androidapp.viewmodel.SignInViewModel;
import com.example.androidapp.viewmodel.WatchViewModel;

public class WatchActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_watch);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        // Retrieve the movieId from the intent's extras
        int movieId = getIntent().getIntExtra("movieId", -1);

        if (movieId == -1) {
            // Handle the error case where movieId is not provided
            finish(); // Close the activity if no valid movieId is passed
        }

        // Add the movie to the user's recommendations
        WatchViewModel watchViewModel = new ViewModelProvider(this).get(WatchViewModel.class);
        watchViewModel.addRecommendation(movieId);

        // Create a new VideoFragment instance
        VideoFragment videoFragment = new VideoFragment();

        // Pass the movieId to the VideoFragment
        Bundle args = new Bundle();
        args.putInt("movieId", movieId);
        args.putBoolean("isFromWatchActivity", true);
        videoFragment.setArguments(args);

        // Load the VideoFragment
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.video_fragment_container, videoFragment)
                .commit();

        findViewById(R.id.btnClose).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(WatchActivity.this, HomeActivity.class);
                // Clear all previous activities and start HomeActivity as a new task
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish(); // Optional, to ensure the current activity is explicitly finished
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        );
    }
}