package com.example.androidapp.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.ui.home.HomeActivity;
import com.example.androidapp.viewmodel.ConsoleViewModel;
import com.example.androidapp.viewmodel.SignInViewModel;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.HomeViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class ConsoleActivity extends AppCompatActivity {

    private EditText etMovieId;

    private EditText etCategoryId;

    private EditText etCategoryName;
    private Button btnDeleteMovie;

    private Button btnDeleteCategory;

    private Button btnPostCategory;
    private CheckBox cbPromoted;
    private ProgressBar progressBar;
    private ConsoleViewModel consoleViewModel;

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
        cbPromoted = findViewById(R.id.cbPromoted);
        btnDeleteMovie = findViewById(R.id.btnDeleteMovie);
        btnDeleteCategory = findViewById(R.id.btnDeleteCategory);
        btnPostCategory = findViewById(R.id.btnPostCategory);
        progressBar = findViewById(R.id.progressBar);


        // Initialize ViewModel
        consoleViewModel = new ViewModelProvider(this).get(ConsoleViewModel.class);


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
                    Toast.makeText(this, "Category added successfully", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(this, "Failed to add category", Toast.LENGTH_SHORT).show();
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
    }}