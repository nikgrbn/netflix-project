package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.ui.home.HomeActivity;
import com.example.androidapp.viewmodel.ConsoleViewModel;

public class ConsoleActivity extends AppCompatActivity {

    private EditText etMovieId, etCategoryId, etCategoryName, etMovieName, etCategories, etDuration, etAgeLimit, etDescription;
    private Button btnDeleteMovie, btnDeleteCategory, btnPostCategory, btnAddMovie, btnUploadImage, btnUploadVideo;
    private CheckBox cbPromoted;
    private ProgressBar progressBar;
    private ConsoleViewModel consoleViewModel;
    private Uri selectedImageUri;
    private Uri selectedVideoUri;

    private final ActivityResultLauncher<Intent> imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedImageUri = result.getData().getData();
                    Toast.makeText(this, "Image selected successfully!", Toast.LENGTH_SHORT).show();
                }
            });

    private final ActivityResultLauncher<Intent> videoPickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedVideoUri = result.getData().getData();
                    Toast.makeText(this, "Video selected successfully!", Toast.LENGTH_SHORT).show();
                }
            });

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_console);

        // Handle back button press
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Intent intent = new Intent(ConsoleActivity.this, HomeActivity.class);
                // Clear all previous activities and start HomeActivity as a new task
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish(); // Optional, to ensure the current activity is explicitly finished
            }
        });

        // Initialize views
        etMovieId = findViewById(R.id.etMovieId);
        etCategoryId = findViewById(R.id.etCategoryId);
        etCategoryName = findViewById(R.id.etCategoryName);
        etMovieName = findViewById(R.id.etMovieName);
        etCategories = findViewById(R.id.etCategories);
        etDuration = findViewById(R.id.etDuration);
        etAgeLimit = findViewById(R.id.etAgeLimit);
        etDescription = findViewById(R.id.etDescription);

        btnDeleteMovie = findViewById(R.id.btnDeleteMovie);
        btnDeleteCategory = findViewById(R.id.btnDeleteCategory);
        btnPostCategory = findViewById(R.id.btnPostCategory);
        btnAddMovie = findViewById(R.id.btnPostMovie);
        btnUploadImage = findViewById(R.id.btnUploadImage);
        btnUploadVideo = findViewById(R.id.btnUploadVideo);

        cbPromoted = findViewById(R.id.cbPromoted);
        progressBar = findViewById(R.id.progressBar);

        // Initialize ViewModel
        consoleViewModel = new ViewModelProvider(this).get(ConsoleViewModel.class);

        // Handle image upload
        btnUploadImage.setOnClickListener(v -> openImagePicker());

        // Handle video upload
        btnUploadVideo.setOnClickListener(v -> openVideoPicker());

        // Handle movie addition
        btnAddMovie.setOnClickListener(v -> handleAddMovie());

        // Observe ViewModel
        observeViewModel();

        // Handle delete button click
        btnDeleteMovie.setOnClickListener(v -> {
            String movieIdStr = etMovieId.getText().toString();
            if (movieIdStr.isEmpty()) {
                Toast.makeText(this, "Please enter a Movie ID", Toast.LENGTH_SHORT).show();
                return;
            }
            int movieId = Integer.parseInt(movieIdStr);
            consoleViewModel.deleteMovie(movieId);
            etMovieId.setText("");
            etMovieId.clearFocus();
        });
        btnDeleteCategory.setOnClickListener(v -> {
            String categoryIdStr = etCategoryId.getText().toString();
            if (categoryIdStr.isEmpty()) {
                Toast.makeText(this, "Please enter a Movie ID", Toast.LENGTH_SHORT).show();
                return;
            }
            int categoryId = Integer.parseInt(categoryIdStr);
            consoleViewModel.deleteCategory(categoryId);
            etCategoryId.setText("");
            etCategoryId.clearFocus();
        });
        // Handle post category button click
        btnPostCategory.setOnClickListener(v -> {
            String categoryName = etCategoryName.getText().toString();
            boolean isPromoted = cbPromoted.isChecked();
            if (categoryName.isEmpty()) {
                Toast.makeText(this, "Please enter a Category Name", Toast.LENGTH_SHORT).show();
                return;
            }
            consoleViewModel.addCategory(categoryName, isPromoted);
            etCategoryName.setText("");
            cbPromoted.setChecked(false);
            etCategoryName.clearFocus();
        });
    }

    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        imagePickerLauncher.launch(intent);
    }

    private void openVideoPicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("video/*");
        videoPickerLauncher.launch(intent);
    }

    private void handleAddMovie() {
        String movieName = etMovieName.getText().toString().trim();
        String categories = etCategories.getText().toString().trim();
        String durationStr = etDuration.getText().toString().trim();
        String ageLimitStr = etAgeLimit.getText().toString().trim();
        String description = etDescription.getText().toString().trim();

        if (movieName.isEmpty()) {
            Toast.makeText(this, "Movie name is required.", Toast.LENGTH_SHORT).show();
            return;
        }

        int duration = durationStr.isEmpty() ? 0 : Integer.parseInt(durationStr);
        int ageLimit = ageLimitStr.isEmpty() ? 0 : Integer.parseInt(ageLimitStr);
        String imagePath = selectedImageUri != null ? selectedImageUri.toString() : null;
        String videoPath = selectedVideoUri != null ? selectedVideoUri.toString() : null;

        consoleViewModel.addMovie(movieName, categories, duration, selectedImageUri, selectedVideoUri, ageLimit, description);

        // Clear fields
        etMovieName.setText("");
        etCategories.setText("");
        etDuration.setText("");
        etAgeLimit.setText("");
        etDescription.setText("");
        selectedImageUri = null;
        selectedVideoUri = null;
    }

    private void observeViewModel() {
        // Observe deletion status
        consoleViewModel.isDeleted().observe(this, isDeleted -> {
            if (isDeleted != null) {
                progressBar.setVisibility(View.GONE);
                if (isDeleted) {
                    Toast.makeText(this, "Deleted successfully", Toast.LENGTH_SHORT).show();
                }
                // Reset the isDeleted LiveData to prevent future triggers
                consoleViewModel.resetIsDeleted();
            }
        });
        // Observe category addition status
        consoleViewModel.isAdded().observe(this, isAdded -> {
            if (isAdded != null) {
                progressBar.setVisibility(View.GONE);
                if (isAdded) {
                    Toast.makeText(this, "Added successfully", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(this, "Failed to add", Toast.LENGTH_SHORT).show();
                }
                // Reset the isAdded LiveData to prevent future triggers
                consoleViewModel.resetIsAdded();
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
