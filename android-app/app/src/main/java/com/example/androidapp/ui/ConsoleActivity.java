package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

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

        consoleViewModel.addMovie(movieName, categories, duration, imagePath, videoPath, ageLimit, description);

        // Clear fields
        etMovieName.setText("");
        etCategories.setText("");
        etDuration.setText("");
        etAgeLimit.setText("");
        etDescription.setText("");
        selectedImageUri = null;
        selectedVideoUri = null;

        Toast.makeText(this, "Movie added successfully!", Toast.LENGTH_SHORT).show();
    }
}
