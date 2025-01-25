package com.example.androidapp.ui.home;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.adapters.CategoryAdapter;
import com.example.androidapp.db.AppDatabase;
import com.example.androidapp.ui.LandingActivity;
import com.example.androidapp.ui.SignInActivity;
import com.example.androidapp.viewmodel.home.HomeViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

import java.util.ArrayList;

public class HomeActivity extends AppCompatActivity {

    private View bannerFragmentContainer;
    private HomeViewModel homeViewModel;
    private RecyclerView rvCategories;
    private CategoryAdapter categoryAdapter;

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

        // Initially hide the banner fragment
        bannerFragmentContainer = findViewById(R.id.banner_fragment_container);
        bannerFragmentContainer.setVisibility(View.GONE);

        // Initialize the view model
        homeViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) getApplication()).getMovieRepository())
        ).get(HomeViewModel.class);
        // Observe LivaData
        observeViewModel();

        // Set up the recycler view
        rvCategories = findViewById(R.id.rvCategories);
        rvCategories.setLayoutManager(new LinearLayoutManager(this));
        rvCategories.setNestedScrollingEnabled(false);

        // Set up the adapter
        categoryAdapter = new CategoryAdapter(new ArrayList<>());
        rvCategories.setAdapter(categoryAdapter);

        // Set up the logout button
        findViewById(R.id.btnLogout).setOnClickListener(v -> {
            logoutUser();
        });

        // Fetch movies by category
        homeViewModel.fetchMoviesByCategory();
    }

    private void logoutUser() {
        // Clear the database
        AppDatabase.getInstance(this).clearAllData();

        Intent intent = new Intent(HomeActivity.this, LandingActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void observeViewModel() {
        // Observe categories
        homeViewModel.getCategories().observe(this, categories -> {
            categoryAdapter.setCategories(categories); // Update the adapter's data
        });

        // Observe errors
        homeViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });

        // Observe loading state
        homeViewModel.isLoading().observe(this, isLoading -> {
            if (isLoading) {
                // Show loading spinner
            } else {
                // Hide loading spinner
            }
        });
    }

    // Callback method to be called when the video playback starts
    public void onVideoStarted() {
        runOnUiThread(() -> {
            // Make the banner fragment visible
            bannerFragmentContainer.setVisibility(View.VISIBLE);
        });
    }
}