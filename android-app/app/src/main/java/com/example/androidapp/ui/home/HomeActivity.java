package com.example.androidapp.ui.home;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.adapters.CategoryAdapter;
import com.example.androidapp.adapters.MovieAdapter;
import com.example.androidapp.data.model.entity.Movie;
import com.example.androidapp.db.AppDatabase;
import com.example.androidapp.ui.LandingActivity;
import com.example.androidapp.ui.SignInActivity;
import com.example.androidapp.viewmodel.home.HomeViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity implements HeaderFragment.HeaderListener {

    private FrameLayout contentContainer;
    private View bannerFragmentContainer;
    private HomeViewModel homeViewModel;
    private RecyclerView rvCategories;
    private RecyclerView searchResultsRecyclerView;
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

        // Initialize the view model
        contentContainer = findViewById(R.id.content_container);
        homeViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) getApplication()).getMovieRepository())
        ).get(HomeViewModel.class);

        // Observe LivaData
        observeViewModel();

        // Add the header fragment
        addHeaderFragment();

        // Default view setup
        setupDefaultView();
    }

    private void addHeaderFragment() {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.header_fragment_container, new HeaderFragment())
                .commit();
    }

    private void observeViewModel() {
        // Observe categories
        homeViewModel.getCategories().observe(this, categories -> {
            if (categories != null && !categories.isEmpty()) {
                categoryAdapter.setCategories(categories);
            }
        });

        // Observe search results
        homeViewModel.getSearchResults().observe(this, (List<Movie> movies) -> {
            if (movies != null) {
                setupSearchResultsView(movies);
            }
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

    private void setupDefaultView() {
        // Show the default layout
        View nestedScrollView = findViewById(R.id.nestedScrollView);
        if (nestedScrollView != null) {
            nestedScrollView.setVisibility(View.VISIBLE);
        }

        // Remove the existing RecyclerView if it exists
        if (searchResultsRecyclerView != null) {
            // Remove the existing RecyclerView
            contentContainer.removeView(searchResultsRecyclerView);
        }

        // Add the banner fragment
        bannerFragmentContainer = findViewById(R.id.banner_fragment_container);
        bannerFragmentContainer.setVisibility(View.GONE);

        // Set up the recycler view
        rvCategories = findViewById(R.id.rvCategories);
        rvCategories.setLayoutManager(new LinearLayoutManager(this));
        rvCategories.setNestedScrollingEnabled(false);

        // Set up the adapter
        categoryAdapter = new CategoryAdapter(new ArrayList<>());
        rvCategories.setAdapter(categoryAdapter);

        // Set up the logout button
        findViewById(R.id.btnLogout).setOnClickListener(v -> logoutUser());

        // Fetch movies by category
        homeViewModel.fetchMoviesByCategory();
    }

    private void setupSearchResultsView(List<Movie> movies) {
        // Hide the default layout
        View nestedScrollView = findViewById(R.id.nestedScrollView);
        if (nestedScrollView != null) {
            nestedScrollView.setVisibility(View.GONE);
        }

        // Remove the existing RecyclerView if it exists
        if (searchResultsRecyclerView != null) {
            // Remove the existing RecyclerView
            contentContainer.removeView(searchResultsRecyclerView);
        }

        // Create a RecyclerView dynamically to display search results
        searchResultsRecyclerView = new RecyclerView(this);

        // Calculate the number of columns based on the screen width
        int itemWidth = 260; // Desired item width in pixels (adjust as needed)
        int screenWidth = getResources().getDisplayMetrics().widthPixels;
        int spanCount = Math.max(1, screenWidth / itemWidth); // At least 1 column

        // Create a GridLayoutManager
        GridLayoutManager layoutManager = new GridLayoutManager(this, spanCount);

        // Set the layout manager to RecyclerView
        searchResultsRecyclerView.setLayoutManager(layoutManager);

        // Set the adapter
        MovieAdapter movieAdapter = new MovieAdapter(movies);
        searchResultsRecyclerView.setAdapter(movieAdapter);

        // Add padding for grid spacing
        int spacing = 16; // Spacing in pixels
        searchResultsRecyclerView.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
                outRect.set(spacing, spacing, spacing, spacing);
            }
        });

        // Replace content in the container
        contentContainer.addView(searchResultsRecyclerView);
    }

    @Override
    public void onSearchQueryChanged(String query) {
        if (query.isEmpty()) {
            // Reset to the default view
            setupDefaultView();
        } else {
            // Fetch search results from ViewModel
            homeViewModel.searchMovies(query);
        }
    }

    // Callback method to be called when the video playback starts
    public void onVideoStarted() {
        runOnUiThread(() -> {
            // Make the banner fragment visible
            bannerFragmentContainer.setVisibility(View.VISIBLE);
        });
    }

    private void logoutUser() {
        // Clear the database
        AppDatabase.getInstance(this).clearAllData();

        Intent intent = new Intent(HomeActivity.this, LandingActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}