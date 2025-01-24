package com.example.androidapp.ui.home;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.db.AppDatabase;
import com.example.androidapp.ui.LandingActivity;
import com.example.androidapp.ui.SignInActivity;
import com.example.androidapp.viewmodel.home.HomeViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class HomeActivity extends AppCompatActivity {

    private HomeViewModel homeViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        homeViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) getApplication()).getMovieRepository())
        ).get(HomeViewModel.class);

        // Set up the logout button
        findViewById(R.id.btnLogout).setOnClickListener(v -> {
            logoutUser();
        });

        // Fetch movies by category
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik4iLCJyb2xlIjp0cnVlLCJpYXQiOjE3Mzc1NTQ0ODF9.3gkcA9-bf36aCj1zxCdRnyczpFaV39M1ilpKUx1rNqo";
        int userId = 1;
        homeViewModel.fetchMoviesByCategory(token, userId);

        // Observe loading state
        observeViewModel();
    }

    private void logoutUser() {
        AppDatabase.getInstance(getApplicationContext()).userDao().delete();
        Intent intent = new Intent(HomeActivity.this, LandingActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void observeViewModel() {
        // Observe errors
        homeViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });

        // Observe sign in status
        homeViewModel.isLoading().observe(this, isLoading -> {
            if (isLoading) {
                // Show loading spinner
            } else {
                // Hide loading spinner
            }
        });
    }
}