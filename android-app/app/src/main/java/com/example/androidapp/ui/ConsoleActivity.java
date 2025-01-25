package com.example.androidapp.ui;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.viewmodel.ConsoleViewModel;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.HomeViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class ConsoleActivity extends AppCompatActivity {

    private EditText etMovieId;
    private Button btnDelete;
    private ProgressBar progressBar;
    private ConsoleViewModel consoleViewModel;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_console);

        // Initialize views
        etMovieId = findViewById(R.id.etMovieId);
        btnDelete = findViewById(R.id.btnDeleteMovie);
        progressBar = findViewById(R.id.progressBar);

        // Initialize ViewModel
        consoleViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) getApplication()).getMovieRepository())
        ).get(ConsoleViewModel.class);

        // Observe ViewModel
        observeViewModel();

        // Handle delete button click
        btnDelete.setOnClickListener(v -> {
            etMovieId.setText("");
            etMovieId.clearFocus();

            String movieIdStr = etMovieId.getText().toString();
            if (movieIdStr.isEmpty()) {
                Toast.makeText(this, "Please enter a Movie ID", Toast.LENGTH_SHORT).show();
                return;
            }
            int movieId = Integer.parseInt(movieIdStr);
            consoleViewModel.deleteMovie(movieId);
        });
    }

    private void observeViewModel() {
        // Observe deletion status
        consoleViewModel.isDeleted().observe(this, isDeleted -> {
            if (isDeleted != null) {
                progressBar.setVisibility(View.GONE);
                if (isDeleted) {
                    Toast.makeText(this, "Movie deleted successfully", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(this, "Failed to delete movie", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Observe loading state
        consoleViewModel.getIsLoading().observe(this, isLoading -> {
            if (isLoading != null) {
                progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
            }
        });

        // Observe errors
        consoleViewModel.getErrorMessage().observe(this, error -> {
            if (error != null && !error.isEmpty()) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
