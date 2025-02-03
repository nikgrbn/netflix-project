package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;

import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.viewmodel.SignUpViewModel;
import com.google.android.material.button.MaterialButton;

public class SignUpActivity extends AppCompatActivity {

    private SignUpViewModel signUpViewModel;
    private EditText nameInput;
    private EditText passwordInput;
    private EditText confirmPasswordInput;
    private EditText displayNameInput;
    private MaterialButton uploadImageButton;
    private Uri selectedImageUri;
    private MaterialButton signUpButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        findViewById(R.id.btnBackArrow).setOnClickListener(v -> {
            finish();
        });

        // ViewModel
        signUpViewModel = new ViewModelProvider(this).get(SignUpViewModel.class);

        // Back arrow button
        findViewById(R.id.btnBackArrow).setOnClickListener(v -> {
            finish();
        });

        // Form fields
        nameInput = findViewById(R.id.etName);
        passwordInput = findViewById(R.id.etPassword);
        confirmPasswordInput = findViewById(R.id.etConfirmPassword);
        displayNameInput = findViewById(R.id.etDisplayName);
        uploadImageButton = findViewById(R.id.btnUploadImage);
        signUpButton = findViewById(R.id.btnSignUp);

        // Handle image upload
        uploadImageButton.setOnClickListener(v -> openImagePicker());

        handleSignUp();

        // Observe sign in status
        observeViewModel();
    }

    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        startActivityForResult(intent, 1);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == RESULT_OK && data != null) {
            selectedImageUri = data.getData();
            Toast.makeText(this, "Image selected successfully!", Toast.LENGTH_SHORT).show();
        }
    }

    void handleSignUp() {
        signUpButton.setOnClickListener(v -> {
            String name = nameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();
            String confirmPassword = confirmPasswordInput.getText().toString().trim();
            String displayName = displayNameInput.getText().toString().trim();


            if (name.isEmpty() || password.isEmpty() || confirmPassword.isEmpty() || displayName.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
                return;
            }

            if (password.length() < 4 || password.length() > 60) {
                Toast.makeText(this, "Password must be between 4 and 60 characters.", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.equals(confirmPassword)) {
                Toast.makeText(this, "Passwords do not match.", Toast.LENGTH_SHORT).show();
                return;
            }

            signUpViewModel.signUp(name, password, confirmPassword, displayName, selectedImageUri);
        });
    }

    private void observeViewModel() {
        // Observe errors
        signUpViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });

        // Observe sign up status
        signUpViewModel.getIsSignedUp().observe(this, isSignedUp -> {
            if (isSignedUp) {
                Toast.makeText(this, "Signed Up Successfully", Toast.LENGTH_SHORT).show();

                Intent intent = new Intent(SignUpActivity.this, SignInActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish();
            }
        });
    }
}